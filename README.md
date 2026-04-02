# Bright Paths Pro - Child Sponsorship Management System

## Overview

Bright Paths Pro is a full-stack web application demonstrating comprehensive child sponsorship management with mock MySQL database operations (INSERT, UPDATE, DELETE, SELECT with WHERE, ORDER BY, GROUP BY, JOIN).

**Features:**
- User authentication (Admin/Sponsor roles)
- Child management (CRUD operations)
- Sponsor dashboard
- Real-time SQL query visualization
- Charts & reports (Recharts)
- Responsive design (Tailwind + shadcn/ui)
- Client-side state management with React Context
- React Router navigation

## Tech Stack
- **Frontend:** React 18, TypeScript, Vite, React Router
- **UI:** shadcn/ui, Tailwind CSS, Lucide icons
- **Data:** Mock data simulating MySQL tables (Children, Sponsors, Donations, etc.)
- **Charts:** Recharts
- **State:** React Context, TanStack Query
- **Forms:** React Hook Form, Zod
- **Testing:** Vitest, Playwright

## Quick Start

```bash
# Install dependencies (Bun or npm)
bun install
# or
npm install

# Start development server
bun run dev
# or
npm run dev
```

Open http://localhost:5173

## Pages & Features

- **Home:** Hero, stats, featured children
- **Children:** Browse/search children (WHERE clause)
- **Admin Dashboard:** Full CRUD, tabs for data management, charts (GROUP BY/JOIN)
- **Sponsor Dashboard:** Personal donations/progress
- **Login/Register:** Role-based auth
- **Query Panel:** Shows executing SQL queries

## Folder Structure
```
src/
├── pages/          # Route components
├── components/     # UI components (Navbar, Footer, shadcn)
├── context/        # AppContext for auth/state
├── data/           # mockData.ts (DB tables)
├── hooks/          # Custom hooks
└── lib/            # Utilities
```

## DBMS Operations Demo

All dashboard actions trigger SQL queries shown in the top Query Panel:

```sql
-- Examples:
INSERT INTO Children ...
UPDATE Children SET ... WHERE Child_ID = ?
DELETE FROM Children WHERE Child_ID = ?
SELECT * FROM Children WHERE Name LIKE '%search%' ORDER BY Name
SELECT c.Name, SUM(d.Amount) FROM Children c LEFT JOIN Donations d GROUP BY c.Child_ID
```

## Testing

```bash
# Unit tests
bun run test

# E2E (Playwright)
bun run playwright test
```

## Deployment

```bash
# Build for production
bun run build

# Preview
bun run preview
```

## License
MIT - Feel free to use/modify for your projects!

**Author:** Vaishnavi Hole

