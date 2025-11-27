// Database connection file
// This creates and exports a database client that you'll use to query your database
// Using @libsql/client - a pure JavaScript SQLite client (NO Python needed!)

import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

// Get database URL from environment variable
// For local SQLite file, use: file:./db.sqlite
// This creates a local SQLite database file (no server needed!)
const dbUrl = process.env.DATABASE_URL || "file:./db.sqlite";

// Create libSQL client
// This is a pure JavaScript implementation - no native compilation needed!
// It works on Windows, Mac, Linux without any Python or build tools
const client = createClient({
  url: dbUrl, // Local file path for SQLite
});

// Create Drizzle database client
// This is what you'll use to query your database
// The { schema } option gives you TypeScript autocomplete for your tables!
export const db = drizzle(client, { schema });

// Export the raw client if needed
export { client };

