// Authentication Middleware for Next.js API Routes
// This middleware protects your API routes by verifying user sessions
// Think of it as a "security guard" that checks if users are logged in

import { NextRequest, NextResponse } from "next/server";
import { lucia } from "./lucia";

// TypeScript type for authenticated user
// This is what we get back when a user is successfully authenticated
export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  isActive: boolean;
  emailVerified: boolean;
}

// Main authentication function
// This checks if the request has a valid session cookie
// Returns the user if authenticated, null if not
export async function getAuthenticatedUser(
  request: NextRequest
): Promise<AuthenticatedUser | null> {
  try {
    // Get the session cookie from the request
    // Lucia stores the session ID in a cookie named "auth_session"
    const sessionId = request.cookies.get("auth_session")?.value;

    // If no session cookie, user is not logged in
    if (!sessionId) {
      return null;
    }

    // Validate the session using Lucia
    // This checks if the session exists in the database and is not expired
    const { user, session } = await lucia.validateSession(sessionId);

    // If session is invalid or expired, return null
    if (!user || !session) {
      return null;
    }

    // Check if user account is active
    if (!user.isActive) {
      return null;
    }

    // Return user data (without sensitive information)
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
    };
  } catch (error) {
    // If anything goes wrong, assume user is not authenticated
    console.error("Authentication error:", error);
    return null;
  }
}

// Middleware wrapper for API routes
// This is a helper function that wraps your API route handler
// It automatically checks authentication and passes the user to your handler
export function withAuth<T = any>(
  handler: (request: NextRequest, user: AuthenticatedUser) => Promise<NextResponse<T>>
) {
  return async (request: NextRequest) => {
    // Get authenticated user
    const user = await getAuthenticatedUser(request);

    // If no user, return 401 Unauthorized
    if (!user) {
      return NextResponse.json(
        {
          error: {
            message: "Unauthorized - Please log in to access this resource",
            code: "UNAUTHORIZED",
          },
        },
        { status: 401 }
      );
    }

    // If user is authenticated, call the handler with the user
    return handler(request, user);
  };
}

// Helper function to require authentication
// Use this in your API routes to check if user is logged in
// Returns the user or throws an error response
export async function requireAuth(
  request: NextRequest
): Promise<{ user: AuthenticatedUser; response?: never } | { user?: never; response: NextResponse }> {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return {
      response: NextResponse.json(
        {
          error: {
            message: "Unauthorized - Authentication required",
            code: "UNAUTHORIZED",
          },
        },
        { status: 401 }
      ),
    };
  }

  return { user };
}
