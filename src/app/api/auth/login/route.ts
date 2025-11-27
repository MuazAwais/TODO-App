// Login API Route - Authenticates a user and creates a session
// POST /api/auth/login

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { lucia } from "@/lib/auth/lucia";
import { comparePassword } from "@/lib/auth/jwt";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: { message: "Email and password are required", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    // Find user by email
    const userResults = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (userResults.length === 0) {
      return NextResponse.json(
        { error: { message: "Invalid email or password", code: "INVALID_CREDENTIALS" } },
        { status: 401 }
      );
    }

    const user = userResults[0];

    // Check if account is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: { message: "Account is deactivated", code: "ACCOUNT_DEACTIVATED" } },
        { status: 403 }
      );
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: { message: "Invalid email or password", code: "INVALID_CREDENTIALS" } },
        { status: 401 }
      );
    }

    // Create session
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    // Return user (without password) and set session cookie
    const { passwordHash: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        user: userWithoutPassword,
        message: "Logged in successfully",
      },
      {
        status: 200,
        headers: {
          "Set-Cookie": sessionCookie.serialize(),
        },
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: { message: "Failed to log in", code: "SERVER_ERROR" } },
      { status: 500 }
    );
  }
}

