// This file defines your database tables using Drizzle ORM
// Think of it as a blueprint for your database structure

import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// Users table - stores user account information
// This is the main table where we store user accounts
export const users = sqliteTable("users", {
  // Auto-incrementing ID (primary key)
  // This is a unique number that identifies each user
  id: text("id").primaryKey(), // Lucia uses text IDs (UUIDs)
  
  // Email must be unique and cannot be null
  // Unique means no two users can have the same email
  email: text("email").notNull().unique(),
  
  // Hashed password (we never store plain passwords!)
  // Hashing is like scrambling an egg - you can't unscramble it
  // When user logs in, we hash their password and compare it to this
  passwordHash: text("password_hash").notNull(),
  
  // Optional user information
  firstName: text("first_name"),
  lastName: text("last_name"),
  
  // Account status (defaults to true/active)
  // We can deactivate accounts without deleting them
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  
  // Email verification status
  // When user registers, we can require email verification
  emailVerified: integer("email_verified", { mode: "boolean" }).default(false),
  
  // Timestamps - stored as integers (Unix timestamps in milliseconds)
  // We'll provide these explicitly when creating/updating users
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

// Sessions table - required by Lucia for authentication
// Think of this as a "login session" - when user logs in, we create a session
// The session ID is stored in a cookie, and we use it to verify the user is logged in
export const sessions = sqliteTable("sessions", {
  // Session ID - unique identifier for this session
  id: text("id").primaryKey(),
  
  // Which user this session belongs to
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // If user is deleted, delete their sessions
  
  // When this session expires (for security)
  // After this time, user must log in again
  // Stored as integer (Unix timestamp in milliseconds) - Lucia provides this as Date
  expiresAt: integer("expires_at").notNull(),
  
  // When this session was created
  // Made nullable because Lucia adapter handles this
  createdAt: integer("created_at"),
});

// Verification tokens table - for password reset and email verification
// When user wants to reset password, we create a token here
// They click a link with this token, and we verify it's valid
export const verificationTokens = sqliteTable("verification_tokens", {
  // The token itself (a random string)
  id: text("id").primaryKey(),
  
  // Which user this token belongs to
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // When this token expires (usually 1 hour for password reset)
  // Stored as integer (Unix timestamp in milliseconds)
  expiresAt: integer("expires_at").notNull(),
  
  // What this token is for (e.g., "password_reset" or "email_verification")
  type: text("type").notNull(), // "password_reset" | "email_verification"
  
  // When this token was created
  // Made nullable because it will be set explicitly when creating tokens
  createdAt: integer("created_at"),
});

// Tasks table - stores todo items
export const tasks = sqliteTable("tasks", {
  // Auto-incrementing ID
  id: integer("id").primaryKey({ autoIncrement: true }),
  
  // Foreign key - links task to user
  // onDelete: 'cascade' means if user is deleted, their tasks are too
  // Must be text to match users.id (which is text for Lucia)
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // Task title (required, max 200 characters)
  title: text("title").notNull(),
  
  // Task description (optional, max 1000 characters)
  description: text("description"),
  
  // Task status - can be: pending, in_progress, or completed
  status: text("status", { enum: ["pending", "in_progress", "completed"] })
    .notNull()
    .default("pending"),
  
  // Priority level - can be: low, medium, or high
  priority: text("priority", { enum: ["low", "medium", "high"] })
    .notNull()
    .default("medium"),
  
  // Optional due date - stored as integer (Unix timestamp in milliseconds)
  dueDate: integer("due_date"),
  
  // Optional category/tag
  category: text("category"),
  
  // Timestamps - stored as integers (Unix timestamps in milliseconds)
  // We'll provide these explicitly when creating/updating tasks
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
  
  // When task was completed (null if not completed)
  completedAt: integer("completed_at"),
});

// Define relationships between tables
// This helps with querying related data (like "get user and all their tasks")
export const usersRelations = relations(users, ({ many }) => ({
  // One user can have many tasks
  tasks: many(tasks),
  // One user can have many sessions (logged in on multiple devices)
  sessions: many(sessions),
  // One user can have many verification tokens (for password resets, etc.)
  verificationTokens: many(verificationTokens),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  // Each task belongs to one user
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  // Each session belongs to one user
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const verificationTokensRelations = relations(verificationTokens, ({ one }) => ({
  // Each verification token belongs to one user
  user: one(users, {
    fields: [verificationTokens.userId],
    references: [users.id],
  }),
}));

// Export types for TypeScript (so you get autocomplete!)
// These types help TypeScript understand what data looks like
export type User = typeof users.$inferSelect; // Type for reading users
export type NewUser = typeof users.$inferInsert; // Type for creating users
export type Task = typeof tasks.$inferSelect; // Type for reading tasks
export type NewTask = typeof tasks.$inferInsert; // Type for creating tasks
export type Session = typeof sessions.$inferSelect; // Type for reading sessions
export type VerificationToken = typeof verificationTokens.$inferSelect; // Type for reading verification tokens

