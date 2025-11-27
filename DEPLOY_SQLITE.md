# 🚀 How to Deploy SQLite to Vercel

## ⚠️ Important: Why File-Based SQLite Won't Work

**Vercel is a serverless platform**, which means:
- ❌ **No persistent file system** - files are deleted between deployments
- ❌ **File-based SQLite (`file:./db.sqlite`) won't work** - the database file will be lost
- ✅ **You need a cloud-hosted database** - like Turso (SQLite-compatible) or PostgreSQL

## ✅ Solution: Use Turso (Cloud SQLite)

**Turso is SQLite-compatible** - your existing code works without changes! It's:
- ✅ Free tier available
- ✅ SQLite-compatible (same SQL syntax)
- ✅ Works with your existing Drizzle ORM setup
- ✅ Fast and globally distributed

---

## 📋 Step-by-Step: Deploy SQLite to Vercel

### Step 1: Create a Turso Database

You have **two options**:

#### Option A: Using Turso Dashboard (Easiest - No CLI needed!)

1. **Sign up for Turso**:
   - Go to [https://turso.tech](https://turso.tech)
   - Click "Sign Up" (free account)
   - You can use GitHub to sign in

2. **Create a Database**:
   - Click "Create Database"
   - Name it: `todo-app` (or any name you like)
   - Choose a region close to you
   - Click "Create"

3. **Get Your Credentials**:
   - After creation, you'll see:
     - **Database URL**: `libsql://todo-app-username.turso.io`
     - **Auth Token**: Click "Show" to reveal it
   - **Copy both** - you'll need them in Step 3

#### Option B: Using Turso CLI (If you have WSL/Git Bash)

```bash
# Install Turso CLI (in WSL or Git Bash)
curl -sSfL https://get.tur.so/install.sh | bash

# Login
turso auth login

# Create database
turso db create todo-app

# Get database URL
turso db show todo-app --url

# Create auth token
turso db tokens create todo-app
```

---

### Step 2: Push Your Schema to Turso

Your database schema needs to be created in Turso. Here's how:

1. **Update your `.env.local` temporarily**:
   ```env
   DATABASE_URL=libsql://your-database-name-username.turso.io
   TURSO_AUTH_TOKEN=your-auth-token-here
   ```

2. **Push the schema**:
   ```bash
   npm run db:push
   ```

   This creates all your tables (`users`, `tasks`, etc.) in Turso!

3. **Verify it worked**:
   - Go back to Turso Dashboard
   - Click on your database
   - You should see your tables listed!

---

### Step 3: Set Up Vercel Environment Variables

1. **Go to Vercel Dashboard**:
   - Visit [https://vercel.com](https://vercel.com)
   - Sign up/Login (use GitHub)

2. **Import Your Project**:
   - Click "Add New Project"
   - Select your `TODO-App` repository
   - Click "Import"

3. **Add Environment Variables**:
   - Before deploying, go to **Settings** → **Environment Variables**
   - Add these variables:

   | Variable | Value | Environments |
   |----------|-------|--------------|
   | `DATABASE_URL` | `libsql://your-database-name-username.turso.io` | ✅ Production, ✅ Preview, ✅ Development |
   | `TURSO_AUTH_TOKEN` | `your-auth-token-here` | ✅ Production, ✅ Preview, ✅ Development |
   | `JWT_SECRET` | `[generate a secure random string]` | ✅ Production, ✅ Preview, ✅ Development |

4. **Generate JWT_SECRET**:
   ```bash
   # In PowerShell
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```
   
   Copy the output and use it as your `JWT_SECRET`.

---

### Step 4: Deploy to Vercel

1. **Deploy**:
   - Go back to the project overview
   - Click "Deploy"
   - Wait for the build to complete (2-3 minutes)

2. **Your app is live!** 🎉
   - Visit: `https://your-project-name.vercel.app`

---

### Step 5: Verify Database Connection

1. **Test your app**:
   - Try registering a new user
   - Create a task
   - Check if data persists

2. **Check Turso Dashboard**:
   - Go to your Turso database
   - You should see data in your tables!

---

## 🔄 Migrating from Local SQLite to Turso

If you already have data in your local `db.sqlite` file:

### Option 1: Export and Import (Recommended)

1. **Export your local database**:
   ```bash
   # Using sqlite3 (if installed)
   sqlite3 db.sqlite .dump > backup.sql
   ```

2. **Import to Turso**:
   - Use Turso Dashboard's SQL editor
   - Or use Turso CLI: `turso db shell your-database-name < backup.sql`

### Option 2: Start Fresh

If you don't have important data:
- Just push the schema: `npm run db:push`
- Start using the new Turso database

---

## 📝 Environment Variables Summary

### Local Development (`.env.local`)
```env
DATABASE_URL=file:./db.sqlite
JWT_SECRET=dev-secret-key-change-in-production-12345
```

### Production (Vercel)
```env
DATABASE_URL=libsql://your-database-name-username.turso.io
TURSO_AUTH_TOKEN=your-auth-token-here
JWT_SECRET=your-secure-random-string-here
```

**Note**: Your code automatically detects which database to use based on the `DATABASE_URL` format!

---

## 🎯 Quick Reference

| Task | Command |
|------|---------|
| Create Turso database | Use [Turso Dashboard](https://turso.tech) |
| Push schema to Turso | `npm run db:push` |
| View database | Turso Dashboard → Your Database |
| Local development | Use `file:./db.sqlite` |
| Production | Use `libsql://...` URL |

---

## 🐛 Troubleshooting

### "Database connection failed"
- ✅ Check `DATABASE_URL` is correct in Vercel
- ✅ Verify `TURSO_AUTH_TOKEN` is set
- ✅ Make sure you pushed the schema: `npm run db:push`

### "Table doesn't exist"
- ✅ Run `npm run db:push` to create tables
- ✅ Check Turso Dashboard to see if tables exist

### "Authentication failed"
- ✅ Verify your `TURSO_AUTH_TOKEN` is correct
- ✅ Generate a new token in Turso Dashboard if needed

---

## 🎉 Success!

Your SQLite-based app is now deployed to Vercel using Turso! 

**Key Points**:
- ✅ Your code works the same (Turso is SQLite-compatible)
- ✅ No code changes needed
- ✅ Free tier available
- ✅ Fast and reliable

---

## 📚 Additional Resources

- [Turso Documentation](https://docs.turso.tech)
- [Vercel Documentation](https://vercel.com/docs)
- [Drizzle ORM with Turso](https://orm.drizzle.team/docs/get-started-sqlite)

---

**Need Help?**
- Check your Vercel build logs
- Verify all environment variables are set
- Make sure schema is pushed to Turso

Happy deploying! 🚀

