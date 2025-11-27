// Passport.js configuration
// Passport is middleware for authentication in Node.js
// It provides "strategies" for different authentication methods

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Local Strategy - for email/password login
// This is used when users log in with email and password
passport.use(
  new LocalStrategy(
    {
      usernameField: "email", // Use 'email' instead of 'username'
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        // Find user by email
        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        // If user doesn't exist
        if (!user || user.length === 0) {
          return done(null, false, { message: "Invalid email or password" });
        }

        const foundUser = user[0];

        // Check if account is active
        if (!foundUser.isActive) {
          return done(null, false, { message: "Account is deactivated" });
        }

        // Compare password with hash
        const isValidPassword = await bcrypt.compare(
          password,
          foundUser.passwordHash
        );

        if (!isValidPassword) {
          return done(null, false, { message: "Invalid email or password" });
        }

        // Success! Return user (without password hash)
        const { passwordHash, ...userWithoutPassword } = foundUser;
        return done(null, userWithoutPassword);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// JWT Strategy - for protecting routes with JWT tokens
// This is used when users make authenticated requests
passport.use(
  new JwtStrategy(
    {
      // Where to find the JWT token (in Authorization header)
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Secret key to verify the token
      secretOrKey: process.env.JWT_SECRET || "fallback-secret",
    },
    async (payload, done) => {
      try {
        // Payload contains user info from the token
        // Find user by ID from token
        const user = await db
          .select()
          .from(users)
          .where(eq(users.id, payload.userId))
          .limit(1);

        if (!user || user.length === 0) {
          return done(null, false);
        }

        const foundUser = user[0];

        // Check if account is active
        if (!foundUser.isActive) {
          return done(null, false);
        }

        // Return user (without password hash)
        const { passwordHash, ...userWithoutPassword } = foundUser;
        return done(null, userWithoutPassword);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serialize user for session (if using sessions)
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session (if using sessions)
passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user || user.length === 0) {
      return done(null, false);
    }

    const { passwordHash, ...userWithoutPassword } = user[0];
    done(null, userWithoutPassword);
  } catch (error) {
    done(error);
  }
});

export default passport;

