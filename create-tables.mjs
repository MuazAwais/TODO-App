// Create tables directly in Turso
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

console.log('\n🔄 Creating tables in Turso...\n');

// Read the migration SQL
const migrationSQL = readFileSync('drizzle/0000_remarkable_shotgun.sql', 'utf8');

// Split by statement breakpoint and execute each statement
const statements = migrationSQL
  .split('--> statement-breakpoint')
  .map(s => s.trim())
  .filter(s => s && s.startsWith('CREATE'));

console.log(`Found ${statements.length} CREATE statements to execute\n`);

try {
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    const tableName = statement.match(/CREATE TABLE `(\w+)`/)?.[1] || 'unknown';
    console.log(`[${i + 1}/${statements.length}] Creating table: ${tableName}...`);
    
    await client.execute(statement);
    console.log(`   ✅ Created ${tableName}`);
  }
  
  // Create the unique index
  console.log('\nCreating unique index on users.email...');
  await client.execute('CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);');
  console.log('   ✅ Created index\n');
  
  console.log('🎉 All tables created successfully!\n');
  
  // Verify
  const result = await client.execute(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name NOT LIKE 'sqlite_%'
    ORDER BY name;
  `);
  
  console.log('✅ Tables in database:');
  result.rows.forEach(row => {
    console.log('   -', row.name);
  });
  console.log('');
  
} catch (error) {
  if (error.message.includes('already exists')) {
    console.log('⚠️  Some tables already exist. Continuing...\n');
  } else {
    console.error('❌ Error creating tables:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

