# 404 Kanban

[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=flat&logo=vercel)](https://404-kanban.vercel.app)
[![Neon](https://img.shields.io/badge/Neon-PostgreSQL-00E599?style=flat&logo=postgresql)](https://neon.tech)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-06B6D4?style=flat&logo=tailwindcss)](https://tailwindcss.com)
[![Drizzle](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=flat)](https://orm.drizzle.team)

A modern, Matrix-inspired Kanban board with cloud sync, built with React 19, Neon PostgreSQL, Drizzle ORM, and shadcn/ui.

## Live Demo

**[https://404-kanban.vercel.app](https://404-kanban.vercel.app)**

## Features

- Drag & drop cards between columns
- Create, edit, and archive cards
- Add labels, due dates, and comments
- **Cloud persistence** with Neon PostgreSQL
- **Polling-based sync** (5-second intervals)
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
| Database | Neon PostgreSQL |
| ORM | Drizzle |
| State | Context API + Polling |
| Routing | React Router 7 |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) 1.3+
- [Neon CLI](https://neon.tech/docs/reference/cli-install) (optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/2701kai/404-kanban.git
cd 404-kanban

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your Neon database URL

# Start development server
bun run dev
```

### Environment Variables

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
VITE_DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

### Commands

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server on port 5173 |
| `bun run build` | Build for production |
| `bun run preview` | Preview production build |
| `bun run typecheck` | Run TypeScript checks |
| `bunx drizzle-kit push` | Push schema changes to database |
| `bun run scripts/seed.ts` | Seed database with default columns |

## Database Schema

```typescript
// columns: id, name, color, order, created_at
// cards: id, column_id, title, description, labels[], due_date, order, archived_at
// comments: id, card_id, author, author_initials, text
// attachments: id, card_id, name, type, url, size
```

## Project Structure

```
src/
├── components/
│   ├── board/        # Card, Column, CardModal
│   ├── layout/       # Header, Sidebar
│   └── ui/           # shadcn/ui components
├── context/          # BoardContext (Drizzle state)
├── lib/
│   ├── db/           # Drizzle schema and client
│   └── utils.ts      # Utility functions
├── pages/            # Home, Today, Archive, NotFound
├── hooks/            # useLocalStorage, useToast
└── types/            # TypeScript interfaces

drizzle/              # Database migrations
scripts/              # Seed scripts
```

## License

MIT
