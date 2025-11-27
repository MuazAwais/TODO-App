# ⚡ Quick Start Guide

Follow these steps to get your TODO App up and running!

## Step 1: Install Dependencies

Open your terminal in the project folder and run:

```bash
npm install
```

**What happens:** This installs all the packages listed in `package.json`. It might take 2-5 minutes.

## Step 2: Create Environment File

Create a file named `.env.local` in the root folder (same level as `package.json`).

**Windows (PowerShell):**
```powershell
New-Item .env.local
```

**Mac/Linux:**
```bash
touch .env.local
```

Then open `.env.local` and paste this:

```env
DATABASE_URL=file:./db.sqlite
JWT_SECRET=dev-secret-key-change-in-production-12345
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

**Save the file!**

## Step 3: Create the Database

Run these commands:

```bash
npm run db:generate
npm run db:migrate
```

**What happens:**
- First command creates migration files
- Second command creates the actual database file (`db.sqlite`)

## Step 4: Start the App

```bash
npm run dev
```

**What happens:** The development server starts. You'll see:
```
✓ Ready in 2.3s
○ Local: http://localhost:3000
```

## Step 5: Open in Browser

Open your browser and go to: **http://localhost:3000**

You should see the welcome page! 🎉

---

## 🎯 What You've Set Up

✅ **Next.js** - Full-stack React framework  
✅ **TypeScript** - Type-safe JavaScript  
✅ **Tailwind CSS** - Utility-first CSS with purple theme  
✅ **Redux Toolkit** - Global state management  
✅ **Drizzle ORM** - Type-safe database queries  
✅ **SQLite** - File-based database  
✅ **JWT + Passport.js** - Authentication ready  
✅ **Formik + Yup** - Form handling ready  
✅ **Axios** - HTTP client configured  
✅ **Radix UI** - UI components ready  

## 🐛 Troubleshooting

### "Cannot find module" errors
**Solution:** Run `npm install` again

### Port 3000 already in use
**Solution:** Kill the process or use a different port:
```bash
npm run dev -- -p 3001
```

### Database errors
**Solution:** Make sure `.env.local` exists and run:
```bash
npm run db:migrate
```

## 📚 Next Steps

1. Read [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed explanations
2. Check [SPECIFICATION.md](./SPECIFICATION.md) for feature requirements
3. Start building your first feature!

---

**Need help?** Check the detailed [SETUP_GUIDE.md](./SETUP_GUIDE.md) for explanations of everything!

