// Script to push schema to Turso
// This ensures environment variables are loaded before pushing

import { readFileSync } from 'fs';
import { execSync } from 'child_process';

// Read .env.local
let envVars = {};
try {
  const envFile = readFileSync('.env.local', 'utf8');
  envFile.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
} catch (error) {
  console.error('❌ ERROR: Could not read .env.local file');
  console.error('   Make sure .env.local exists with DATABASE_URL and TURSO_AUTH_TOKEN');
  process.exit(1);
}

// Set environment variables
process.env.DATABASE_URL = envVars.DATABASE_URL;
process.env.TURSO_AUTH_TOKEN = envVars.TURSO_AUTH_TOKEN;

console.log('\n🔄 Pushing schema to Turso...\n');
console.log('Database:', envVars.DATABASE_URL?.substring(0, 40) + '...\n');

// Run drizzle-kit push
try {
  execSync('npm run db:push', { 
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: envVars.DATABASE_URL, TURSO_AUTH_TOKEN: envVars.TURSO_AUTH_TOKEN }
  });
  console.log('\n✅ Schema pushed successfully!\n');
} catch (error) {
  console.error('\n❌ Failed to push schema');
  process.exit(1);
}

