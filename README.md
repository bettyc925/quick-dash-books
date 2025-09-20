# Accounting Dashboard - React/TypeScript Frontend

## ⚠️ IMPORTANT: This is NOT a Python Project

This is a **React/TypeScript frontend application** with Supabase backend. There are **no Python files** like `app/`, `requirements.txt`, or Alembic migrations.

## Quick Start for PyCharm

### 1. Prerequisites
- Node.js 18+ and npm (NOT Python)
- PyCharm with Node.js plugin

### 2. Setup
```bash
# Install dependencies (equivalent to pip install -r requirements.txt)
npm install

# Create environment file
cp .env.example .env

# Start development server (equivalent to python manage.py runserver)
npm run dev
```

### 3. Access Application
- **Development**: http://localhost:8080
- **Production Build**: `npm run build`

## Project Structure

This is a **frontend-only React project**:

```
├── package.json              # Dependencies (like requirements.txt)
├── .env                      # Environment variables
├── src/                      # Source code (React components)
│   ├── main.tsx             # Entry point
│   ├── App.tsx              # Main app component
│   ├── components/          # UI components
│   ├── pages/               # Page components
│   └── integrations/        # Supabase integration
├── supabase/                # Database migrations (SQL, not Alembic)
│   └── migrations/          # SQL files
└── public/                  # Static assets
```

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI**: Tailwind CSS, Radix UI, shadcn/ui  
- **Backend**: Supabase (fully managed cloud)
- **State**: TanStack Query
- **Routing**: React Router DOM

## Key Features

- Dashboard with financial overview
- Task management and automation
- Client and company management
- Financial reporting
- Multi-company support
- User authentication and roles
- Responsive design

## For PyCharm Users

### Run Configurations
1. **Dev Server**: `npm run dev`
2. **Build**: `npm run build` 
3. **Lint**: `npm run lint`

### File Types
- `.tsx` - React TypeScript components
- `.ts` - TypeScript files
- `.css` - Stylesheets with Tailwind

### Database
- **Backend**: Supabase cloud (no local setup needed)
- **Migrations**: SQL files in `supabase/migrations/`
- **Connection**: JavaScript client library

## Environment Variables (.env)

```env
VITE_SUPABASE_PROJECT_ID="jbywtxlcdosupgzwkivh"
VITE_SUPABASE_PUBLISHABLE_KEY="your-key-here"
VITE_SUPABASE_URL="https://jbywtxlcdosupgzwkivh.supabase.co"
```

## Commands (npm, not pip/python)

```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run linting
```

## Deployment

Deploy via [Lovable](https://lovable.dev/projects/489330a7-8ed9-4552-b201-b3df6bb064c0) or build static files with `npm run build`.
