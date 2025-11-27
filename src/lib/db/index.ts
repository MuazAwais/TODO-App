// Database connection file
// This creates and exports a database client that you'll use to query your database
// Using @libsql/client - a pure JavaScript SQLite client (NO Python needed!)

import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

// Get database URL from environment variable
// For local SQLite file, use: file:./db.sqlite
// For Turso (cloud), use: libsql://your-database.turso.io
const dbUrl = process.env.DATABASE_URL || "file:./db.sqlite";

// Get Turso auth token (only needed for cloud Turso databases)
// For local SQLite files, this is not needed
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

// Create libSQL client
// This is a pure JavaScript implementation - no native compilation needed!
// It works on Windows, Mac, Linux without any Python or build tools
// Supports both local SQLite files and Turso cloud databases
const client = createClient({
  url: dbUrl,
  // Only include authToken if it's a Turso URL (starts with libsql://)
  // and if TURSO_AUTH_TOKEN is provided
  ...(dbUrl.startsWith("libsql://") && tursoAuthToken
    ? { authToken: tursoAuthToken }
    : {}),
});

// Create Drizzle database client
// This is what you'll use to query your database
// The { schema } option gives you TypeScript autocomplete for your tables!
export const db = drizzle(client, { schema });

// Export the raw client if needed
export { client };

