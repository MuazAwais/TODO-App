# 🚀 Setup Guide - TODO App

This guide will walk you through setting up your TODO App step by step. Don't worry if you're new to this - we'll explain everything!

## 📋 Prerequisites

Before you start, make sure you have:
- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- A code editor like **VS Code**

## 🎯 Step-by-Step Setup

### Step 1: Install Dependencies

Open your terminal in the project folder and run:

```bash
npm install
```

**What this does:**
- Reads `package.json` to see what packages you need
- Downloads and installs all dependencies (libraries) into `node_modules/`
- This might take a few minutes - be patient!

**What you're installing:**
- **Next.js**: The React framework for building web apps
- **TypeScript**: Adds type safety to JavaScript
- **Redux Toolkit**: For managing global app state
- **Radix UI**: Pre-built accessible UI components
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: For making HTTP requests
- **Formik + Yup**: For form handling and validation
- **Drizzle ORM**: For database operations
- **JWT + Passport.js**: For authentication
- And many more!

### Step 2: Create Environment Variables

Create a file named `.env.local` in the root of your project:

```bash
# Windows (PowerShell)
New-Item .env.local

# Mac/Linux
touch .env.local
```

Then add this content to `.env.local`:

```env
# Database Configuration
DATABASE_URL=file:./db.sqlite

# JWT Configuration
# IMPORTANT: Generate a secure secret for production!
JWT_SECRET=dev-secret-key-change-in-production-12345
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Application Configuration
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

**What are environment variables?**
- They store configuration that shouldn't be in your code
- `.env.local` is gitignored (not uploaded to GitHub) for security
- `NEXT_PUBLIC_*` variables are available in the browser
- Other variables are only available on the server

**Important:** Never commit `.env.local` to Git! It contains secrets.

### Step 3: Initialize the Database

Run this command to create your SQLite database:

```bash
npm run db:generate
```

This creates migration files based on your schema.

Then run:

```bash
npm run db:migrate
```

This creates the actual database file (`db.sqlite`) with your tables.

**What just happened?**
- Drizzle looked at your schema (`src/lib/db/schema.ts`)
- Created SQL migration files
- Applied them to create the database
- You now have `users` and `tasks` tables!

### Step 4: Start the Development Server

Run:

```bash
npm run dev
```

**What this does:**
- Starts the Next.js development server
- Watches for file changes (auto-reloads)
- Usually runs on `http://localhost:3000`

Open your browser and visit `http://localhost:3000`

You should see the welcome page! 🎉

## 📁 Project Structure Explained

```
TODO-App/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx         # Root layout (wraps all pages)
│   │   ├── page.tsx           # Home page
│   │   ├── globals.css        # Global styles
│   │   └── api/               # API routes (backend)
│   ├── components/            # Reusable React components
│   │   └── ThemeToggle.tsx    # Dark/light mode toggle
│   └── lib/                    # Library/utility code
│       ├── db/                # Database stuff
│       │   ├── schema.ts      # Database table definitions
│       │   └── index.ts       # Database connection
│       ├── api/               # API client (Axios)
│       ├── store/             # Redux store
│       └── utils/             # Helper functions
├── drizzle.config.ts          # Drizzle ORM configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Project dependencies
└── .env.local                 # Environment variables (create this!)
```

## 🎨 Understanding the Tech Stack

### Next.js
- **What it is**: A React framework that handles routing, server-side rendering, and API routes
- **Why we use it**: One framework for frontend AND backend!

### TypeScript
- **What it is**: JavaScript with types (catches errors before runtime)
- **Why we use it**: Prevents bugs, better autocomplete in your editor

### Redux Toolkit
- **What it is**: State management (stores data accessible to all components)
- **Why we use it**: Manages user data, tasks, authentication state globally

### Radix UI
- **What it is**: Pre-built accessible components (buttons, dialogs, etc.)
- **Why we use it**: Accessible by default, fully customizable with Tailwind

### Tailwind CSS
- **What it is**: Utility-first CSS (write styles as classes)
- **Why we use it**: Fast development, consistent design, built-in dark mode

### Drizzle ORM
- **What it is**: Type-safe database query builder
- **Why we use it**: TypeScript autocomplete for database queries!

### SQLite
- **What it is**: File-based database (no server needed)
- **Why we use it**: Perfect for development, easy to migrate later

## 🛠️ Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter (check code quality)
npm run lint

# Generate database migrations
npm run db:generate

# Apply database migrations
npm run db:migrate

# Open Drizzle Studio (database GUI)
npm run db:studio
```

## 🐛 Troubleshooting

### "Module not found" errors
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then `npm install`

### Database errors
- Make sure `.env.local` exists with `DATABASE_URL=file:./db.sqlite`
- Run `npm run db:migrate` to create the database

### Port 3000 already in use
- Change the port: `npm run dev -- -p 3001`
- Or kill the process using port 3000

### TypeScript errors
- Make sure all files are saved
- Restart your TypeScript server in VS Code (Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server")

## 🎓 Next Steps

Now that your project is set up:

1. **Explore the code**: Look at `src/app/page.tsx` and `src/lib/db/schema.ts`
2. **Try the theme toggle**: Add `<ThemeToggle />` to your page
3. **Read the specification**: Check `SPECIFICATION.md` for feature requirements
4. **Start building**: Create your first API route and component!

## 📚 Learning Resources

- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [Drizzle ORM Docs](https://orm.drizzle.team/)

Happy coding! 🚀

