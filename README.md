# Nudggg

A habit-tracking and personal growth app built with React, Vite, and Supabase.

## Quick Start

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Build for production
npm run build
```

The app runs without any configuration. Supabase features activate when environment variables are provided.

## Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | No | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | No | Supabase anonymous/public key |

All variables are optional. Without Supabase configured, the app runs in local mode.

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the SQL Editor to create tables
3. Copy your project URL and anon key to `.env`

### Database Tables

- **users** - User profiles and preferences
- **goals** - Personal goals with progress tracking
- **tasks** - Tasks linked to goals
- **journal_entries** - Journal with mood tracking and tags

## Project Structure

```
client/src/
  components/   # Reusable UI components
  pages/        # Route pages (Dashboard, Goals, Habits, Journal, etc.)
  lib/          # Utilities and client setup (supabaseClient, trpc, utils)
  hooks/        # Custom React hooks
  contexts/     # React context providers
  _core/        # Core framework hooks (auth)
supabase/
  schema.sql    # Database schema for Supabase
```

## Build Output

Production build outputs to `dist/`:

```
dist/
  index.html
  assets/
  robots.txt
  sitemap.xml
```

Deploy to any static hosting provider (Netlify, Vercel, Cloudflare Pages, GitHub Pages).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build client for production |
| `npm run build:full` | Build client + server |
| `npm run check` | TypeScript type checking |
| `npm run format` | Format code with Prettier |
| `npm run test` | Run tests |
