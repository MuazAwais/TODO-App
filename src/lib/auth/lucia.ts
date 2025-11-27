// Lucia Authentication Configuration
// Lucia is a modern authentication library that handles sessions securely
// Think of it as a helper that manages user login/logout for you

import { Lucia } from "lucia";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "@/lib/db";
import { sessions, users } from "@/lib/db/schema";

// Create the database adapter
// This tells Lucia how to read/write sessions and users from our database
const adapter = new DrizzleSQLiteAdapter(db, sessions, users);

// Initialize Lucia with our adapter
// This creates the "auth" object we'll use throughout the app
export const lucia = new Lucia(adapter, {
  // Session cookie settings
  sessionCookie: {
    // Cookie attributes for security
    attributes: {
      // Only send cookie over HTTPS in production
      secure: process.env.NODE_ENV === "production",
      // Prevent JavaScript from accessing the cookie (XSS protection)
      httpOnly: true,
      // SameSite prevents CSRF attacks
      sameSite: "strict",
    },
  },
  
  // Get user attributes (what data to include when we get a user)
  getUserAttributes: (attributes) => {
    return {
      // These are the fields we can access from the user object
      id: attributes.id,
      email: attributes.email,
      firstName: attributes.firstName,
      lastName: attributes.lastName,
      isActive: attributes.isActive,
      emailVerified: attributes.emailVerified,
    };
  },
});

// TypeScript declarations
// This tells TypeScript what our user and session objects look like
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      id: string;
      email: string;
      firstName: string | null;
      lastName: string | null;
      isActive: boolean;
      emailVerified: boolean;
    };
  }
}

// Export types for use in other files
export type Auth = typeof lucia;

