# 404 Kanban

[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=flat&logo=vercel)](https://404-kanban.vercel.app)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3FCF8E?style=flat&logo=supabase)](https://supabase.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-06B6D4?style=flat&logo=tailwindcss)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?style=flat&logo=vite)](https://vite.dev)
[![Bun](https://img.shields.io/badge/Bun-1.3-FBF0DF?style=flat&logo=bun)](https://bun.sh)

A modern, Matrix-inspired Kanban board with real-time sync, built with React 19, Supabase, and shadcn/ui.

## Live Demo

**[https://404-kanban.vercel.app](https://404-kanban.vercel.app)**

## Features

- Drag & drop cards between columns
- Create, edit, and archive cards
- Add labels, due dates, and comments
- **Real-time sync** across devices (Supabase)
- **Cloud persistence** - data saved to PostgreSQL
- Responsive design (mobile-friendly)
- Matrix-inspired dark theme

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 |
| Build Tool | Vite 7 |
| Runtime | Bun 1.3 |
| Styling | Tailwind CSS 4 |
| UI Components | shadcn/ui + Radix |
| Backend | Supabase (PostgreSQL) |
| State | Context API + Supabase Realtime |
| Routing | React Router 7 |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) 1.3+
- [Supabase CLI](https://supabase.com/docs/guides/cli) (optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/404-kanban.git
cd 404-kanban

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
bun run dev
```

### Environment Variables

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Commands

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server on port 5173 |
| `bun run build` | Build for production |
| `bun run preview` | Preview production build |
| `bun run typecheck` | Run TypeScript checks |
| `supabase db push` | Push database migrations |

## Database Schema

```sql
-- columns: id, name, color, order
-- cards: id, column_id, title, description, labels[], due_date, archived_at
-- comments: id, card_id, author, text
-- attachments: id, card_id, name, type, url
```

## Project Structure

```
src/
├── components/
│   ├── board/        # Card, Column, CardModal
│   ├── layout/       # Header, Sidebar
│   └── ui/           # shadcn/ui components
├── context/          # BoardContext (Supabase state)
├── lib/              # supabase.ts, utils.ts
├── pages/            # Home, Today, Archive, NotFound
├── hooks/            # useLocalStorage, useMobile, useToast
├── types/            # TypeScript interfaces
└── data/             # Initial seed data

supabase/
└── migrations/       # Database migrations
```

## License

MIT
