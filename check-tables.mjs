// Check what tables exist in Turso
import { readFileSync } from 'fs';
import { createClient } from '@libsql/client';

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
  process.exit(1);
}

const client = createClient({
  url: envVars.DATABASE_URL,
  authToken: envVars.TURSO_AUTH_TOKEN,
});

console.log('\n🔍 Checking tables in Turso...\n');

try {
  // Query to get all table names
  const result = await client.execute(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name NOT LIKE 'sqlite_%'
    ORDER BY name;
  `);
  
  if (result.rows.length === 0) {
    console.log('❌ No tables found! Tables need to be created.\n');
    console.log('Expected tables: users, sessions, tasks, verification_tokens\n');
  } else {
    console.log('✅ Found tables:');
    result.rows.forEach(row => {
      console.log('   -', row.name);
    });
    console.log('');
    
    // Check for required tables
    const tableNames = result.rows.map(r => r.name);
    const required = ['users', 'sessions', 'tasks', 'verification_tokens'];
    const missing = required.filter(t => !tableNames.includes(t));
    
    if (missing.length > 0) {
      console.log('⚠️  Missing tables:', missing.join(', '), '\n');
    } else {
      console.log('✅ All required tables exist!\n');
    }
  }
} catch (error) {
  console.error('❌ Error checking tables:', error.message);
  process.exit(1);
}

