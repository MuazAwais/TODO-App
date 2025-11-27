# Vercel Environment Variables - Ready to Copy

## Your Environment Variables

Add these **exact values** to your Vercel project:

---

### 1. DATABASE_URL

```
libsql://todo-muaz-awais.aws-ap-south-1.turso.io
```

**Settings:**
- ✅ Production
- ✅ Preview  
- ✅ Development

---

### 2. TURSO_AUTH_TOKEN

**⚠️ You need to get this token first!**

Run this command to get your token:
```bash
turso db tokens create todo-muaz-awais
```

Then copy the token and use it as the value.

**Settings:**
- ✅ Production
- ✅ Preview
- ✅ Development

---

### 3. JWT_SECRET

**✅ Generated for you:**

```
ZEzwf6+TTBdvF7DqLCZrbJsloQEfS9Qp/IYx6qRlNq0=
```

**Settings:**
- ✅ Production
- ✅ Preview
- ✅ Development

---

## How to Add in Vercel

1. Go to your Vercel project: https://vercel.com/dashboard
2. Click on your project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add each variable one by one:
   - Name: `DATABASE_URL`
   - Value: `libsql://todo-muaz-awais.aws-ap-south-1.turso.io`
   - Select all environments (Production, Preview, Development)
   - Click **Save**

6. Repeat for `TURSO_AUTH_TOKEN` and `JWT_SECRET`

---

## Quick Checklist

- [ ] Get Turso auth token: `turso db tokens create todo-muaz-awais`
- [ ] Add `DATABASE_URL` = `libsql://todo-muaz-awais.aws-ap-south-1.turso.io`
- [ ] Add `TURSO_AUTH_TOKEN` = `[your token from step 1]`
- [ ] Add `JWT_SECRET` = `ZEzwf6+TTBdvF7DqLCZrbJsloQEfS9Qp/IYx6qRlNq0=`
- [ ] Redeploy your application

---

## After Adding Variables

1. **Redeploy**: Go to Deployments → Click "Redeploy" on latest deployment
2. **Initialize Database**: Run `npm run db:push` after deployment
3. **Test**: Visit your Vercel URL and test the app

---

## Need Help Getting Turso Token?

If you don't have Turso CLI:

1. **Install Turso CLI**:
   ```bash
   # Windows PowerShell
   irm https://get.tur.so/install.ps1 | iex
   ```

2. **Login**:
   ```bash
   turso auth login
   ```

3. **Get Token**:
   ```bash
   turso db tokens create todo-muaz-awais
   ```

---

That's it! Your app should be ready to deploy! 🚀

