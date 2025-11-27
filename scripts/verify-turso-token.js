// Script to verify Turso token and database connection
// Run with: node scripts/verify-turso-token.js

const fs = require('fs');
const path = require('path');

// Load .env.local manually
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [key, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=').trim();
        // Remove quotes if present
        const cleanValue = value.replace(/^["']|["']$/g, '');
        process.env[key.trim()] = cleanValue;
      }
    });
  }
}

loadEnv();

const { createClient } = require('@libsql/client');

async function verifyToken() {
  const dbUrl = process.env.DATABASE_URL;
  const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

  console.log('\n🔍 Verifying Turso Token...\n');

  // Check if environment variables are set
  if (!dbUrl) {
    console.error('❌ ERROR: DATABASE_URL is not set in .env.local');
    console.log('   Please add: DATABASE_URL=libsql://your-database.turso.io');
    process.exit(1);
  }

  if (!tursoAuthToken) {
    console.error('❌ ERROR: TURSO_AUTH_TOKEN is not set in .env.local');
    console.log('   Please add: TURSO_AUTH_TOKEN=your-token-here');
    process.exit(1);
  }

  // Check if it's a Turso URL
  if (!dbUrl.startsWith('libsql://')) {
    console.log('⚠️  WARNING: DATABASE_URL does not start with libsql://');
    console.log(`   Current value: ${dbUrl}`);
    console.log('   This might be a local SQLite file, not Turso.');
    console.log('   For Turso, it should be: libsql://your-database.turso.io\n');
  }

  // Display token info (first 20 chars for security)
  const tokenPreview = tursoAuthToken.substring(0, 20) + '...';
  console.log('📋 Configuration:');
  console.log(`   DATABASE_URL: ${dbUrl}`);
  console.log(`   TURSO_AUTH_TOKEN: ${tokenPreview}`);
  console.log(`   Token length: ${tursoAuthToken.length} characters\n`);

  // Test connection
  try {
    console.log('🔌 Testing connection to Turso...\n');

    const client = createClient({
      url: dbUrl,
      ...(dbUrl.startsWith('libsql://') && tursoAuthToken
        ? { authToken: tursoAuthToken }
        : {}),
    });

    // Try a simple query to verify the connection
    const result = await client.execute('SELECT 1 as test');

    if (result.rows && result.rows.length > 0) {
      console.log('✅ SUCCESS! Token is valid and connection works!\n');
      console.log('   Connection test result:', result.rows[0]);
      console.log('\n🎉 Your Turso credentials are correctly configured.\n');
      
      // Try to get database info
      try {
        const tablesResult = await client.execute(
          "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
        );
        if (tablesResult.rows && tablesResult.rows.length > 0) {
          console.log('📊 Tables in database:');
          tablesResult.rows.forEach((row) => {
            console.log(`   - ${row.name}`);
          });
        } else {
          console.log('📊 No tables found. Run: npm run db:push');
        }
      } catch (err) {
        console.log('⚠️  Could not list tables (this is okay if schema not pushed yet)');
      }
      
      process.exit(0);
    } else {
      console.error('❌ ERROR: Connection test returned no results');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ ERROR: Failed to connect to Turso\n');
    
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      console.error('   🔴 401 Unauthorized - Invalid token!');
      console.error('\n   Possible issues:');
      console.error('   1. Token is incorrect or expired');
      console.error('   2. Token was revoked');
      console.error('   3. Token doesn\'t have proper permissions');
      console.error('\n   Solution:');
      console.error('   1. Go to https://turso.tech');
      console.error('   2. Click on your database');
      console.error('   3. Click "Tokens" or "Show" to reveal token');
      console.error('   4. Copy the full token and update .env.local');
      console.error('   5. Make sure there are no extra spaces or quotes\n');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('   🔴 Connection Error - Invalid database URL!');
      console.error('\n   Possible issues:');
      console.error('   1. DATABASE_URL is incorrect');
      console.error('   2. Database doesn\'t exist');
      console.error('   3. Network connectivity issue');
      console.error('\n   Solution:');
      console.error('   1. Verify DATABASE_URL in Turso Dashboard');
      console.error('   2. Make sure it starts with libsql://');
      console.error('   3. Check your internet connection\n');
    } else {
      console.error('   Error details:', error.message);
      console.error('\n   Full error:', error);
    }
    
    process.exit(1);
  }
}

// Run the verification
verifyToken().catch((error) => {
  console.error('\n❌ Unexpected error:', error);
  process.exit(1);
});

