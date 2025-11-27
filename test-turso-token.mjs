// Test script to validate Turso token
// Run: node test-turso-token.mjs

import { readFileSync } from 'fs';
import { createClient } from '@libsql/client';

// Read .env.local file
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
  console.error('   Make sure .env.local exists in the project root');
  process.exit(1);
}

const dbUrl = envVars.DATABASE_URL;
const tursoAuthToken = envVars.TURSO_AUTH_TOKEN;

console.log('\n🔍 Checking Turso Token...\n');

// Check if environment variables are set
if (!dbUrl) {
  console.error('❌ ERROR: DATABASE_URL is not set in .env.local');
  console.log('   Make sure you have a .env.local file with DATABASE_URL');
  process.exit(1);
}

if (!tursoAuthToken) {
  console.error('❌ ERROR: TURSO_AUTH_TOKEN is not set in .env.local');
  console.log('   Make sure you have TURSO_AUTH_TOKEN in your .env.local file');
  process.exit(1);
}

// Check if it's a Turso URL
if (!dbUrl.startsWith('libsql://')) {
  console.warn('⚠️  WARNING: DATABASE_URL does not start with libsql://');
  console.log('   Current value:', dbUrl);
  console.log('   For Turso, it should start with libsql://');
  process.exit(1);
}

console.log('✓ DATABASE_URL is set:', dbUrl.substring(0, 40) + '...');
console.log('✓ TURSO_AUTH_TOKEN is set:', tursoAuthToken.substring(0, 20) + '...\n');

// Try to connect
console.log('🔄 Testing connection to Turso...\n');

const client = createClient({
  url: dbUrl,
  authToken: tursoAuthToken,
});

// Test query
try {
  const result = await client.execute('SELECT 1 as test');
  console.log('✅ SUCCESS! Token is valid and connection works!');
  console.log('   Test query result:', result.rows);
  console.log('\n🎉 Your Turso credentials are correct!\n');
  process.exit(0);
} catch (error) {
  console.error('❌ ERROR: Connection failed!\n');
  
  if (error.message.includes('401') || error.message.includes('Unauthorized')) {
    console.error('   This is a 401 Unauthorized error.');
    console.error('   Possible causes:');
    console.error('   1. Token is incorrect or expired');
    console.error('   2. Token doesn\'t have permission for this database');
    console.error('   3. Database URL is incorrect');
    console.error('\n   Solutions:');
    console.error('   - Go to https://turso.tech and verify your token');
    console.error('   - Generate a new token in Turso Dashboard');
    console.error('   - Make sure DATABASE_URL matches your database');
  } else if (error.message.includes('ENOTFOUND') || error.message.includes('network')) {
    console.error('   Network error - cannot reach Turso servers');
    console.error('   Check your internet connection');
  } else {
    console.error('   Error details:', error.message);
  }
  
  console.error('\n   Full error:', error.message);
  process.exit(1);
}

