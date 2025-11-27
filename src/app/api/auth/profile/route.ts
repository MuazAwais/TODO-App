// Profile API Route - Handles PUT (update profile)
// PUT /api/auth/profile

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/middleware";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import * as Yup from "yup";

// Validation schema for profile updates
const profileUpdateSchema = Yup.object({
  firstName: Yup.string().max(50, "First name must be less than 50 characters").optional().nullable(),
  lastName: Yup.string().max(50, "Last name must be less than 50 characters").optional().nullable(),
  email: Yup.string().email("Invalid email address").optional(),
});

// PUT /api/auth/profile - Update user profile
export async function PUT(request: NextRequest) {
  // Step 1: Authenticate the user
  const authResult = await requireAuth(request);
  if (authResult.response) {
    return authResult.response;
  }
  const { user } = authResult;

  try {
    // Step 2: Get and validate the request body
    const body = await request.json();

    let validatedData;
    try {
      validatedData = await profileUpdateSchema.validate(body, {
        abortEarly: false,
        stripUnknown: true,
      });
    } catch (validationError: any) {
      return NextResponse.json(
        {
          error: {
            message: "Validation failed",
            code: "VALIDATION_ERROR",
            details: validationError.errors,
          },
        },
        { status: 400 }
      );
    }

    // Step 3: Check if email is being changed and if it's already taken
    if (validatedData.email && validatedData.email !== user.email) {
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, validatedData.email))
        .limit(1);

      if (existingUser.length > 0) {
        return NextResponse.json(
          {
            error: {
              message: "Email already in use",
              code: "EMAIL_EXISTS",
            },
          },
          { status: 409 }
        );
      }
    }

    // Step 4: Prepare update data
    const updateData: any = {
      updatedAt: Date.now(),
    };

    if (validatedData.firstName !== undefined) {
      updateData.firstName = validatedData.firstName || null;
    }
    if (validatedData.lastName !== undefined) {
      updateData.lastName = validatedData.lastName || null;
    }
    if (validatedData.email !== undefined) {
      updateData.email = validatedData.email;
      // If email is changed, mark as unverified
      updateData.emailVerified = false;
    }

    // Step 5: Update the user
    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, user.id))
      .returning();

    // Step 6: Return updated user (without password)
    const { passwordHash: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json(
      {
        user: userWithoutPassword,
        message: "Profile updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      {
        error: {
          message: "Failed to update profile",
          code: "UPDATE_ERROR",
        },
      },
      { status: 500 }
    );
  }
}

