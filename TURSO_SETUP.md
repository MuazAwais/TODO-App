# 🔧 Turso Setup Guide - Fix 401 Error

## ⚠️ The 401 Error

A **401 Unauthorized** error from Turso means:
- ❌ Missing or incorrect `TURSO_AUTH_TOKEN`
- ❌ Missing or incorrect `DATABASE_URL`
- ❌ Token doesn't have proper permissions

---

## ✅ Solution: Set Up Turso (Choose One Method)

### Method 1: Using Turso Dashboard (Easiest - Recommended!)

**No CLI needed!** Use the web interface:

1. **Go to Turso Dashboard**:
   - Visit: [https://turso.tech](https://turso.tech)
   - Sign up or Login (you can use GitHub)

2. **Create a Database**:
   - Click **"Create Database"** or **"New Database"**
   - Name it: `todo-app` (or any name)
   - Choose a region (closest to you)
   - Click **"Create"**

3. **Get Your Credentials**:
   After creating, you'll see:
   - **Database URL**: `libsql://todo-app-username.turso.io`
   - **Auth Token**: Click **"Show"** or **"Reveal"** to see it
   
   **Copy both values!**

4. **Set Environment Variables**:

   **For Local Development** (`.env.local`):
   ```env
   DATABASE_URL=libsql://your-database-name-username.turso.io
   TURSO_AUTH_TOKEN=your-auth-token-here
   JWT_SECRET=your-secure-random-string
   ```

   **For Vercel**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add:
     - `DATABASE_URL` = your Turso database URL
     - `TURSO_AUTH_TOKEN` = your auth token
     - `JWT_SECRET` = generate a secure random string

5. **Push Your Schema**:
   ```bash
   npm run db:push
   ```

   This creates your tables in Turso!

---

### Method 2: Using Turso CLI (If you have WSL/Git Bash)

If you want to use CLI, first set up WSL:

1. **Install WSL Distribution**:
   ```powershell
   # Run PowerShell as Administrator
   wsl --install Ubuntu
   ```

2. **After WSL restarts, open WSL and install Turso**:
   ```bash
   curl -sSfL https://get.tur.so/install.sh | bash
   ```

3. **Login to Turso**:
   ```bash
   turso auth login
   ```

4. **Create Database**:
   ```bash
   turso db create todo-app
   ```

5. **Get Database URL**:
   ```bash
   turso db show todo-app --url
   ```

6. **Create Auth Token**:
   ```bash
   turso db tokens create todo-app
   ```

7. **Copy the values** and add them to your `.env.local` and Vercel.

---

## 🔍 Verify Your Setup

### Check Your Environment Variables

**Local (`.env.local`)**:
```env
DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJIUzI1NiIs...  (long token)
```

**Important**:
- ✅ `DATABASE_URL` must start with `libsql://`
- ✅ `TURSO_AUTH_TOKEN` must be the full token (starts with `eyJ...`)
- ✅ No extra spaces or quotes around values

### Test the Connection

1. **Push your schema**:
   ```bash
   npm run db:push
   ```

2. **If successful**, you should see:
   ```
   ✓ Schema pushed successfully
   ```

3. **If you get 401 error**, check:
   - ✅ Token is correct (copy from Turso Dashboard)
   - ✅ Database URL is correct
   - ✅ No extra spaces in `.env.local`
   - ✅ Restart your dev server after changing `.env.local`

---

## 🐛 Troubleshooting 401 Error

### Issue 1: Token Not Set
**Symptom**: `401 Unauthorized` or `Missing auth token`

**Solution**:
1. Go to Turso Dashboard
2. Click on your database
3. Click "Tokens" or "Auth Tokens"
4. Click "Create Token" or "Show" existing token
5. Copy the full token (starts with `eyJ...`)
6. Add to `.env.local`:
   ```env
   TURSO_AUTH_TOKEN=eyJhbGciOiJIUzI1NiIs...  (paste full token)
   ```
7. Restart your dev server: `npm run dev`

### Issue 2: Wrong Database URL
**Symptom**: `401 Unauthorized` or connection errors

**Solution**:
1. Check your `DATABASE_URL` in Turso Dashboard
2. It should look like: `libsql://todo-app-username.turso.io`
3. Make sure it starts with `libsql://` (not `https://` or `file://`)
4. Update `.env.local` and restart server

### Issue 3: Token Expired or Revoked
**Symptom**: `401 Unauthorized` after it was working

**Solution**:
1. Generate a new token in Turso Dashboard
2. Update `TURSO_AUTH_TOKEN` in `.env.local`
3. Update in Vercel environment variables too
4. Restart your dev server

### Issue 4: Schema Not Pushed
**Symptom**: `Table doesn't exist` errors

**Solution**:
```bash
# Make sure your .env.local has Turso credentials
npm run db:push
```

---

## 📝 Quick Checklist

Before deploying, make sure:

- [ ] Created Turso database
- [ ] Copied `DATABASE_URL` from Turso Dashboard
- [ ] Copied `TURSO_AUTH_TOKEN` from Turso Dashboard
- [ ] Added both to `.env.local`
- [ ] Ran `npm run db:push` successfully
- [ ] Added both to Vercel environment variables
- [ ] Generated `JWT_SECRET` and added to both places

---

## 🎯 Next Steps

1. **Set up Turso** (use Dashboard method above)
2. **Update `.env.local`** with your credentials
3. **Push schema**: `npm run db:push`
4. **Test locally**: `npm run dev`
5. **Deploy to Vercel** with environment variables set

---

## 💡 Pro Tips

- **Use Turso Dashboard** - It's easier than CLI on Windows
- **Keep tokens secure** - Never commit `.env.local` to Git
- **Generate new tokens** if you suspect they're compromised
- **Check Vercel logs** if deployment fails - they show the exact error

---

## 🆘 Still Getting 401?

1. **Check Vercel build logs** - Look for database connection errors
2. **Verify environment variables** in Vercel dashboard
3. **Test locally first** - Make sure `.env.local` works
4. **Generate new token** - Sometimes tokens expire

---

**Need help?** Check:
- [Turso Documentation](https://docs.turso.tech)
- [Vercel Environment Variables Guide](https://vercel.com/docs/concepts/projects/environment-variables)

Good luck! 🚀

