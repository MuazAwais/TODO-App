# Vercel Environment Variables Setup

## Your Database Configuration

**Database URL**: `libsql://todo-muaz-awais.aws-ap-south-1.turso.io`

---

## Step 1: Get Your Turso Auth Token

You need to get your Turso authentication token. Run this command:

```bash
turso db tokens create todo-muaz-awais
```

Or if you have the Turso CLI installed, you can also get it from the Turso dashboard.

**Copy the token** - you'll need it in the next step.

---

## Step 2: Generate JWT Secret

Generate a secure JWT secret using one of these methods:

### Option A: Using Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Option B: Using OpenSSL
```bash
openssl rand -base64 32
```

**Copy the generated secret** - you'll need it in the next step.

---

## Step 3: Add Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click on **Settings** → **Environment Variables**
3. Add the following variables:

### Variable 1: DATABASE_URL

- **Name**: `DATABASE_URL`
- **Value**: `libsql://todo-muaz-awais.aws-ap-south-1.turso.io`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

### Variable 2: TURSO_AUTH_TOKEN

- **Name**: `TURSO_AUTH_TOKEN`
- **Value**: `[Your Turso auth token from Step 1]`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

### Variable 3: JWT_SECRET

- **Name**: `JWT_SECRET`
- **Value**: `[Your generated JWT secret from Step 2]`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

---

## Step 4: Verify Setup

After adding all variables:

1. Go to **Deployments** tab
2. Click **Redeploy** on your latest deployment (or create a new deployment)
3. The build should complete successfully

---

## Quick Copy-Paste Reference

Here's a quick reference for your environment variables:

```env
DATABASE_URL=libsql://todo-muaz-awais.aws-ap-south-1.turso.io
TURSO_AUTH_TOKEN=[Get from: turso db tokens create todo-muaz-awais]
JWT_SECRET=[Generate using: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"]
```

---

## Troubleshooting

### If you don't have Turso CLI installed:

1. **Install Turso CLI**:
   ```bash
   # macOS/Linux
   curl -sSfL https://get.tur.so/install.sh | bash
   
   # Windows (PowerShell)
   irm https://get.tur.so/install.ps1 | iex
   ```

2. **Login to Turso**:
   ```bash
   turso auth login
   ```

3. **Get your auth token**:
   ```bash
   turso db tokens create todo-muaz-awais
   ```

### If build fails:

- Verify all three environment variables are set
- Check that the Turso auth token is correct
- Ensure the database URL is exactly: `libsql://todo-muaz-awais.aws-ap-south-1.turso.io`

---

## Next Steps After Setting Variables

1. ✅ Add all environment variables in Vercel
2. ✅ Redeploy your application
3. ✅ Initialize database schema (run migrations)
4. ✅ Test your application

### Initialize Database Schema

After deployment, you need to push your database schema. You can do this by:

**Option A: Using Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link to project
vercel link

# Pull environment variables
vercel env pull .env.local

# Push schema
npm run db:push
```

**Option B: Using Turso CLI directly**
```bash
# Set environment variables locally
export DATABASE_URL="libsql://todo-muaz-awais.aws-ap-south-1.turso.io"
export TURSO_AUTH_TOKEN="your-token-here"

# Push schema
npm run db:push
```

---

## Your Specific Configuration

- **Database Name**: `todo-muaz-awais`
- **Database URL**: `libsql://todo-muaz-awais.aws-ap-south-1.turso.io`
- **Region**: `aws-ap-south-1` (Asia Pacific - Mumbai)

---

Good luck with your deployment! 🚀

