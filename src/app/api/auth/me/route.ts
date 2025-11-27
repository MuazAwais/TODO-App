// Get Current User API Route - Returns the authenticated user's info
// GET /api/auth/me

import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/middleware";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        { error: { message: "Not authenticated", code: "UNAUTHORIZED" } },
        { status: 401 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: { message: "Failed to get user", code: "SERVER_ERROR" } },
      { status: 500 }
    );
  }
}

