# Project Dependencies

## Runtime Dependencies (package.json)

### Core Framework
- `react` ^18.3.1 - React library
- `react-dom` ^18.3.1 - React DOM renderer
- `typescript` ^5.8.3 - TypeScript language

### Build Tool
- `vite` ^5.4.19 - Fast build tool and dev server
- `@vitejs/plugin-react-swc` ^3.11.0 - React plugin for Vite

### UI Framework & Components
- `tailwindcss` ^3.4.17 - Utility-first CSS framework
- `@radix-ui/react-*` - Headless UI components
- `lucide-react` ^0.462.0 - Icon library
- `class-variance-authority` ^0.7.1 - Component variants
- `clsx` ^2.1.1 - Conditional class names
- `tailwind-merge` ^2.6.0 - Merge Tailwind classes

### Backend Integration
- `@supabase/supabase-js` ^2.57.4 - Supabase client
- `@tanstack/react-query` ^5.83.0 - Server state management

### Routing & Navigation
- `react-router-dom` ^6.30.1 - Client-side routing

### Forms & Validation
- `react-hook-form` ^7.61.1 - Form handling
- `@hookform/resolvers` ^3.10.0 - Form validation resolvers
- `zod` ^3.25.76 - Schema validation

### Charts & Data Visualization  
- `recharts` ^2.15.4 - Chart library

### Date Handling
- `date-fns` ^4.1.0 - Date utility library
- `react-day-picker` ^8.10.1 - Date picker component

### UI Enhancements
- `sonner` ^1.7.4 - Toast notifications
- `next-themes` ^0.3.0 - Theme switching
- `embla-carousel-react` ^8.6.0 - Carousel component
- `react-resizable-panels` ^2.1.9 - Resizable panels
- `vaul` ^0.9.9 - Drawer component

## Development Dependencies

### Linting & Code Quality
- `eslint` ^9.32.0 - Code linting
- `@eslint/js` ^9.32.0 - ESLint JavaScript config
- `typescript-eslint` ^8.38.0 - TypeScript ESLint rules

### Type Definitions
- `@types/node` ^22.16.5 - Node.js types  
- `@types/react` ^18.3.23 - React types
- `@types/react-dom` ^18.3.7 - React DOM types

### CSS Processing
- `postcss` ^8.5.6 - CSS processor
- `autoprefixer` ^10.4.21 - CSS vendor prefixes
- `@tailwindcss/typography` ^0.5.16 - Tailwind typography plugin
- `tailwindcss-animate` ^1.0.7 - Tailwind animations

### Development Tools
- `globals` ^15.15.0 - Global definitions
- `lovable-tagger` ^1.1.9 - Development tagging tool

## Installation

```bash
# Install all dependencies
npm install

# Install production dependencies only
npm install --production
```

## Key Package Purposes

- **@radix-ui/react-*** - Accessible, unstyled UI primitives
- **@supabase/supabase-js** - Database, auth, and real-time subscriptions
- **@tanstack/react-query** - Caching, synchronization, and server state
- **react-hook-form** - Performant forms with minimal re-renders
- **tailwindcss** - Utility-first CSS framework for rapid UI development
- **vite** - Lightning-fast build tool with HMR for development