import type { Config } from "drizzle-kit";

export default {
  // Schema file location - where your database tables are defined
  schema: "./src/lib/db/schema.ts",
  
  // Output directory for migrations
  out: "./drizzle",
  
  // Database connection - using libSQL (pure JavaScript, no Python!)
  // For drizzle-kit, we use "turso" driver even for local files
  dialect: "sqlite",
  driver: "turso",
  
  // Database file location
  // Use "file:" prefix for local SQLite files
  // Use "libsql://" prefix for Turso cloud databases
  dbCredentials: {
    url: process.env.DATABASE_URL || "file:./db.sqlite",
    // Add authToken for Turso (only needed for cloud databases)
    ...(process.env.TURSO_AUTH_TOKEN
      ? { authToken: process.env.TURSO_AUTH_TOKEN }
      : {}),
  },
  
  // Verbose output (helpful for debugging)
  verbose: true,
  
  // Strict mode (ensures type safety)
  strict: true,
} satisfies Config;

