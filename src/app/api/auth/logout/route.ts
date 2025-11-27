// Logout API Route - Ends the user's session
// POST /api/auth/logout

import { NextRequest, NextResponse } from "next/server";
import { lucia } from "@/lib/auth/lucia";
import { getAuthenticatedUser } from "@/lib/auth/middleware";

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const user = await getAuthenticatedUser(request);

    if (user) {
      // Get session ID from cookie
      const sessionId = request.cookies.get("auth_session")?.value;

      if (sessionId) {
        // Invalidate the session in Lucia
        await lucia.invalidateSession(sessionId);
      }
    }

    // Create blank session cookie to clear it
    const blankSessionCookie = lucia.createBlankSessionCookie();

    return NextResponse.json(
      { message: "Logged out successfully" },
      {
        status: 200,
        headers: {
          "Set-Cookie": blankSessionCookie.serialize(),
        },
      }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: { message: "Failed to log out", code: "SERVER_ERROR" } },
      { status: 500 }
    );
  }
}

