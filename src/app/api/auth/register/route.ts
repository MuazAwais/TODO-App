// Register API Route - Creates a new user account
// POST /api/auth/register

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { lucia } from "@/lib/auth/lucia";
import { hashPassword } from "@/lib/auth/jwt";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName } = body;

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: { message: "Email and password are required", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: { message: "Password must be at least 8 characters", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: { message: "Email already registered", code: "EMAIL_EXISTS" } },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const userId = nanoid(); // Generate unique ID
    const now = Date.now(); // Current timestamp in milliseconds (Unix timestamp)
    
    const [newUser] = await db
      .insert(users)
      .values({
        id: userId,
        email,
        passwordHash,
        firstName: firstName || null,
        lastName: lastName || null,
        createdAt: now, // Unix timestamp in milliseconds
        updatedAt: now,  // Unix timestamp in milliseconds
      })
      .returning();

    // Create session
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    // Return user (without password) and set session cookie
    const { passwordHash: _, ...userWithoutPassword } = newUser;
    
    return NextResponse.json(
      {
        user: userWithoutPassword,
        message: "Account created successfully",
      },
      {
        status: 201,
        headers: {
          "Set-Cookie": sessionCookie.serialize(),
        },
      }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    
    // Provide more detailed error messages
    let errorMessage = "Failed to create account";
    if (error?.code === "SQLITE_ERROR") {
      errorMessage = "Database error. Please make sure the database tables are created. Run: npm run db:push";
    } else if (error?.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { 
        error: { 
          message: errorMessage, 
          code: "SERVER_ERROR",
          details: process.env.NODE_ENV === "development" ? error?.stack : undefined
        } 
      },
      { status: 500 }
    );
  }
}

