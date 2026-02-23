# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Restaurant POS system (Solmed168) built with the T3 Stack — manages food orders, beverages, expenses, and payment processing with thermal printer support.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Drizzle ORM + PostgreSQL, TanStack Query, next-safe-action, Tailwind CSS + Radix UI, Zustand, Ultracite (Biome)

## Development Commands

```bash
pnpm run dev              # Start Next.js dev server
pnpm run build            # Build for production
pnpm run lint             # Run Next.js linter

# Database (Drizzle Kit)
pnpm run db:push          # Push schema changes to database
pnpm run db:generate      # Generate migrations
pnpm run db:migrate       # Run migrations
pnpm run db:studio        # Open Drizzle Studio

# Code Quality (Ultracite/Biome)
npx ultracite fix         # Format and fix code automatically
npx ultracite check       # Check for issues without fixing
```

Run `npx ultracite fix` before committing.

## Architecture & Key Patterns

### Path Alias

`~/*` maps to `./src/*` (configured in `tsconfig.json`). Always use `~/` for imports.

### Project Structure

- `src/app/` — Next.js App Router pages (`/order`, `/order-history`, `/expense`)
- Feature folders use `_` prefix subdirectories: `_actions/`, `_components/`, `_hooks/`, `_validators/`
- `src/components/ui/` — shadcn/ui components
- `src/server/db/schema.ts` — Drizzle schema definitions
- `src/app/data.ts` — Static menu data (setMenus, alacarte, beverages, snacks, addons) with generated UUIDs

### Database Schema

Drizzle ORM with `solmed168_` table prefix (see `drizzle.config.ts`). Three tables:

- **orders**: Products stored as JSON (`CartItem[]`), payment/serving methods, table numbers
- **products**: Product catalog (currently menu items live in `data.ts` as static data)
- **expenses**: Business expense tracking

Use Drizzle ORM query builder exclusively, never raw SQL. After schema changes, run `pnpm run db:push`.

### Server Actions

- Built with `next-safe-action` — base client in `src/app/order/_actions/root.ts`
- Each action validates inputs using Zod schemas from `_validators/`
- All action files must have `"use server"` directive at top
- Expense actions reuse the same base action client from `order/_actions/root.ts`

### State Management

- **Zustand**: Cart state (`src/app/order/_hooks/useCart.ts`) — persisted to localStorage
- **TanStack Query**: Server state management and data fetching
- **React Hook Form + Zod**: Form validation

### Thermal Printer

Web Bluetooth API via `react-thermal-printer` and `react-web-bluetooth`. Hook: `src/app/order/_hooks/useThermalPrinterContext.tsx`

### Date Handling

Uses **Luxon** (`DateTime`) for date operations (see expense actions for example).

## Environment Variables

Required in `.env`:

```
DATABASE_URL=postgresql://...  # PostgreSQL connection string
NODE_ENV=development          # development | test | production
```

Validated at build time via `@t3-oss/env-nextjs` in `src/env.js`. Skip with `SKIP_ENV_VALIDATION=1` for Docker builds.

## Code Quality & Linting (Ultracite/Biome)

This project extends Ultracite's strict Biome rules (`biome.jsonc`). Key rules that differ from defaults:

- **No `console` methods** — they are forbidden
- **No TypeScript enums** — use `as const` instead
- **No `any` type** — all code must be strictly typed
- Use `export type` / `import type` for type-only imports/exports
- Use arrow functions instead of function expressions
- Always include button `type` attribute (`"button"`, `"submit"`, or `"reset"`)
- Accompany `onClick` with keyboard handlers (`onKeyDown`/`onKeyUp`/`onKeyPress`)
- Use `next/image` instead of `<img>` tags
- Don't use Array index as keys — use stable IDs
