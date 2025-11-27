# TODO-App

A full-stack todo application built with Next.js, TypeScript, and modern web technologies.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   Create a `.env.local` file in the root directory:
   ```env
   DATABASE_URL=file:./db.sqlite
   JWT_SECRET=dev-secret-key-change-in-production-12345
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   NODE_ENV=development
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

3. **Initialize database:**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed setup instructions for beginners
- **[SPECIFICATION.md](./SPECIFICATION.md)** - Complete project specification

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom purple theme
- **UI Components**: Radix UI
- **State Management**: Redux Toolkit
- **Forms**: Formik + Yup
- **HTTP Client**: Axios
- **Database**: SQLite with Drizzle ORM
- **Authentication**: JWT + Passport.js

## 📁 Project Structure

```
src/
├── app/              # Next.js pages and API routes
├── components/        # React components
└── lib/              # Utilities and configurations
    ├── db/          # Database schema and connection
    ├── api/         # API client (Axios)
    ├── auth/        # Authentication utilities
    ├── store/       # Redux store
    ├── utils/       # Helper functions
    └── validations/ # Yup validation schemas
```

## 🎨 Features

- ✅ Light/Dark mode with purple theme
- ✅ User authentication (JWT)
- ✅ Task CRUD operations
- ✅ Type-safe database queries (Drizzle ORM)
- ✅ Form validation (Formik + Yup)
- ✅ Responsive design

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Apply database migrations
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## 🔐 Security Notes

- Never commit `.env.local` to version control
- Change `JWT_SECRET` to a strong random string in production
- Use environment variables for all sensitive data

## 📖 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Drizzle ORM](https://orm.drizzle.team/)

## 🤝 Contributing

This is a learning project. Feel free to experiment and modify as needed!

---

**Happy Coding! 🚀** 
