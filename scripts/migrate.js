// Auto-confirm migration script
// This runs the migration and automatically confirms

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Running database migration...');
console.log('This will create: users, sessions, tasks, and verification_tokens tables');

// Run the migration
const child = execSync('npm run db:push', {
  stdio: 'inherit',
  input: 'Yes\n'
});

console.log('Migration completed!');

