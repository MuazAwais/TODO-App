# Vercel Deployment Guide

This guide will help you deploy your TODO App to Vercel.

## ⚠️ Important: Database Configuration

**Vercel is a serverless platform**, which means:
- ❌ **File-based SQLite won't work** (no persistent file system)
- ✅ **Use Turso (recommended)** or another hosted database

Your code already supports Turso! You just need to:
1. Sign up for a free Turso account: https://turso.tech
2. Create a database
3. Get your database URL and auth token
4. Add them to Vercel environment variables

---

## Step 1: Prepare Your Repository

Make sure all your code is committed and pushed to GitHub:

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

---

## Step 2: Sign Up / Login to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up or log in (you can use your GitHub account)
3. Click **"Add New Project"**

---

## Step 3: Import Your GitHub Repository

1. **Import Git Repository**
   - Select your GitHub account
   - Find and select `TODO-App` repository
   - Click **"Import"**

2. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

---

## Step 4: Set Up Environment Variables

Click **"Environment Variables"** and add the following:

### Required Variables:

1. **DATABASE_URL**
   - **Value**: Your Turso database URL
   - **Format**: `libsql://your-database-name-username.turso.io`
   - **Example**: `libsql://todo-app-muaz.turso.io`
   - **Environments**: Production, Preview, Development (select all)

2. **TURSO_AUTH_TOKEN** (if using Turso)
   - **Value**: Your Turso auth token
   - **How to get**: Run `turso db tokens create your-database-name` in Turso CLI
   - **Environments**: Production, Preview, Development (select all)

3. **JWT_SECRET**
   - **Value**: A secure random string
   - **Generate**: `openssl rand -base64 32` or `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
   - **Example**: `aB3xK9mP2qR7vT5wY8zA1bC4dE6fG0hI3jK5lM7nO9pQ2rS4tU6vW8xY0zA`
   - **Environments**: Production, Preview, Development (select all)

### Optional Variables:

4. **NEXT_PUBLIC_API_URL** (optional)
   - **Value**: `/api` (default, usually not needed)
   - **Environments**: Production, Preview, Development

---

## Step 5: Set Up Turso Database (Recommended)

### Option A: Using Turso CLI (Recommended)

1. **Install Turso CLI**:
   ```bash
   # macOS/Linux
   curl -sSfL https://get.tur.so/install.sh | bash
   
   # Windows (requires WSL)
   # First, install WSL (run PowerShell as Administrator):
   wsl --install
   
   # Then, in WSL, run:
   curl -sSfL https://get.tur.so/install.sh | bash
   ```
   
   **Note**: Windows doesn't have native Turso CLI support. You need WSL (Windows Subsystem for Linux) installed first. Alternatively, you can use the [Turso Dashboard](https://turso.tech) to manage your database without the CLI.

2. **Login to Turso**:
   ```bash
   turso auth login
   ```

3. **Create Database**:
   ```bash
   turso db create todo-app
   ```

4. **Get Database URL**:
   ```bash
   turso db show todo-app --url
   ```
   Copy this URL → Use as `DATABASE_URL` in Vercel

5. **Create Auth Token**:
   ```bash
   turso db tokens create todo-app
   ```
   Copy this token → Use as `TURSO_AUTH_TOKEN` in Vercel

6. **Push Schema to Turso**:
   ```bash
   # Update your .env.local temporarily
   DATABASE_URL=libsql://your-database-url.turso.io
   TURSO_AUTH_TOKEN=your-auth-token
   
   # Push schema
   npm run db:push
   ```

### Option B: Using Turso Dashboard

1. Go to [Turso Dashboard](https://turso.tech)
2. Sign up / Login
3. Create a new database
4. Copy the database URL and auth token
5. Add them to Vercel environment variables

---

## Step 6: Update Database Configuration (if needed)

Your code already supports Turso! Just make sure your `drizzle.config.ts` is set correctly:

```typescript
// drizzle.config.ts
dbCredentials: {
  url: process.env.DATABASE_URL || "file:./db.sqlite",
  authToken: process.env.TURSO_AUTH_TOKEN, // Add this for Turso
}
```

**Note**: You may need to update `src/lib/db/index.ts` to include the auth token for Turso.

---

## Step 7: Deploy!

1. Click **"Deploy"** button
2. Wait for the build to complete (usually 2-3 minutes)
3. Your app will be live at: `https://your-project-name.vercel.app`

---

## Step 8: Post-Deployment Setup

### Initialize Database Schema

After deployment, you need to run migrations. You have two options:

**Option A: Using Vercel CLI** (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link to your project
vercel link

# Run migrations
vercel env pull .env.local
npm run db:push
```

**Option B: Using Turso CLI**
```bash
# Set environment variables
export DATABASE_URL="libsql://your-db.turso.io"
export TURSO_AUTH_TOKEN="your-token"

# Push schema
npm run db:push
```

---

## Troubleshooting

### Build Fails

- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify `package.json` has correct build scripts

### Database Connection Errors

- Verify `DATABASE_URL` is correct
- Check `TURSO_AUTH_TOKEN` is set (if using Turso)
- Ensure database schema is pushed

### Authentication Not Working

- Verify `JWT_SECRET` is set
- Check cookie settings (should work automatically)
- Ensure session cookies are being set

### 404 Errors on Routes

- Verify Next.js App Router structure is correct
- Check `next.config.js` for any redirects
- Ensure API routes are in `app/api/` directory

---

## Environment Variables Summary

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | ✅ Yes | Database connection URL | `libsql://db.turso.io` |
| `TURSO_AUTH_TOKEN` | ✅ Yes* | Turso authentication token | `eyJhbGciOiJIUzI1NiIs...` |
| `JWT_SECRET` | ✅ Yes | Secret for JWT tokens | `aB3xK9mP2qR7vT5wY8zA1...` |
| `NEXT_PUBLIC_API_URL` | ❌ No | API base URL | `/api` |

*Required only if using Turso

---

## Next Steps After Deployment

1. ✅ Test your app at the Vercel URL
2. ✅ Create a test account
3. ✅ Verify database operations work
4. ✅ Set up custom domain (optional)
5. ✅ Enable analytics (optional)

---

## Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Turso Documentation](https://docs.turso.tech)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

## Support

If you encounter issues:
1. Check Vercel build logs
2. Check browser console for errors
3. Verify all environment variables are set
4. Ensure database schema is initialized

Happy deploying! 🚀

