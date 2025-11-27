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
  dbCredentials: {
    url: process.env.DATABASE_URL || "file:./db.sqlite",
  },
  
  // Verbose output (helpful for debugging)
  verbose: true,
  
  // Strict mode (ensures type safety)
  strict: true,
} satisfies Config;

