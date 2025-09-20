# Quick Setup Guide for PyCharm

## Important: This is a React/TypeScript Project (Not Python)

This project is a **frontend React application** with Supabase backend. There are **no Python files** like `app/`, `requirements.txt`, or Alembic migrations.

## Files You Need

### 1. Package Dependencies (equivalent to requirements.txt)
- `package.json` - Contains all JavaScript dependencies
- `package-lock.json` - Lock file for exact versions

### 2. Environment Configuration
- `.env` - Environment variables for Supabase connection

### 3. Database Migrations (Supabase SQL, not Alembic)
Located in `supabase/migrations/` directory:
- `20250919032153_00014f21-d38f-4f70-bfa6-317e518a5bbc.sql`
- `20250919032209_e4b2e0d2-0049-4a2d-b0e6-288afb8e28c8.sql`
- And other migration files

### 4. Startup Commands (npm, not Python)
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## PyCharm Setup Steps

1. **Open Project**: Open the project folder in PyCharm
2. **Install Node.js Plugin**: Install Node.js plugin if not already installed
3. **Set Node.js Interpreter**: Configure Node.js interpreter in settings
4. **Install Dependencies**: Run `npm install` in terminal
5. **Create .env**: Copy environment variables to `.env` file
6. **Run Development Server**: Execute `npm run dev`

## File Structure for PyCharm

```
project-root/
├── package.json              # Dependencies (like requirements.txt)
├── .env                      # Environment variables
├── vite.config.ts           # Build configuration
├── tailwind.config.ts       # CSS framework config
├── tsconfig.json            # TypeScript configuration
├── src/                     # Source code
│   ├── main.tsx            # Entry point
│   ├── App.tsx             # Main app component
│   ├── components/         # UI components
│   ├── pages/              # Page components
│   ├── hooks/              # React hooks
│   └── integrations/       # Supabase integration
├── supabase/               # Database migrations
│   └── migrations/         # SQL migration files
└── public/                 # Static assets
```

## Database (Supabase, not PostgreSQL/SQLite)

- **Backend**: Fully managed by Supabase cloud
- **Migrations**: SQL files in `supabase/migrations/`
- **Connection**: Via JavaScript client library
- **No local database setup required**

## Run Commands

```bash
# Development
npm run dev          # Starts dev server on http://localhost:8080

# Production
npm run build        # Builds static files for deployment
npm run preview      # Preview production build

# Utilities
npm run lint         # Code linting
```

This is a modern web application stack - all "backend" functionality is provided by Supabase cloud services.