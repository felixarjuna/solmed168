# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a restaurant management system (Solmed168) built with the T3 Stack. It's a Point of Sale (POS) system for managing food orders, beverages, expenses, and payment processing with thermal printer support.

**Tech Stack:**
- Next.js 14 (App Router)
- TypeScript
- Drizzle ORM + PostgreSQL
- TanStack Query
- next-safe-action (server actions)
- Tailwind CSS + Radix UI
- Zustand (state management)
- Ultracite (linting/formatting via Biome)

## Development Commands

```bash
# Development
npm run dev              # Start Next.js dev server

# Database
npm run db:push          # Push schema changes to database
npm run db:generate      # Generate migrations
npm run db:migrate       # Run migrations
npm run db:studio        # Open Drizzle Studio

# Build & Deploy
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run Next.js linter

# Code Quality (Ultracite/Biome)
npx ultracite fix        # Format and fix code automatically
npx ultracite check      # Check for issues without fixing
```

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── _components/              # Shared components across pages
│   ├── order/                    # Order management page
│   │   ├── _actions/             # Server actions for orders
│   │   ├── _components/          # Order-specific components
│   │   ├── _hooks/               # React hooks (useCart, useThermalPrinter, etc.)
│   │   └── _validators/          # Zod schemas for validation
│   ├── order-history/            # View past orders
│   ├── expense/                  # Expense tracking page
│   └── data.ts                   # Static product/menu data
├── components/ui/                # Reusable UI components (shadcn/ui)
├── lib/                          # Utility functions
├── server/
│   └── db/
│       ├── index.ts              # Database connection
│       └── schema.ts             # Drizzle schema definitions
└── env.js                        # Environment variable validation (@t3-oss/env-nextjs)
```

## Architecture & Key Patterns

### Database Schema
The app uses Drizzle ORM with three main tables (see [src/server/db/schema.ts](src/server/db/schema.ts)):
- **orders**: Stores order records with products JSON, payment/serving methods, table numbers
- **products**: Product catalog (currently menu items are in `data.ts` as static data)
- **expenses**: Business expense tracking

All tables use the `solmed168_` prefix (configured in `drizzle.config.ts`).

### Server Actions Pattern
Server actions are organized in `_actions/` directories within feature folders:
- Actions use `next-safe-action` for type-safe server actions
- Base action client is defined in `src/app/order/_actions/root.ts`
- Each action validates inputs using Zod schemas from `_validators/`

### State Management
- **Zustand**: Used for cart state in `src/app/order/_hooks/useCart.ts`
- **TanStack Query**: Used for server state management and data fetching
- **React Hook Form + Zod**: Used for form validation

### Menu Data
All menu items, beverages, snacks, and add-ons are defined as static data in [src/app/data.ts](src/app/data.ts):
- `setMenus`: Main food items (bakso, mie)
- `alacarte`: Individual items
- `beverages`: Drinks
- `snacks`: Snack items
- `addons`: Additional items like takeaway cups
- UUIDs are generated for each item using the `uuid` package

### Component Organization
- **Page components**: In app directory route folders
- **Feature components**: In `_components/` subdirectories within feature folders (prefixed with `_` to exclude from routing)
- **Shared UI components**: In `src/components/ui/` (shadcn/ui components)
- **Shared app components**: In `src/app/_components/`

### Thermal Printer Integration
The app supports thermal printing via Web Bluetooth API:
- Hook: `src/app/order/_hooks/useThermalPrinter.tsx`
- Library: `react-thermal-printer` and `react-web-bluetooth`
- Used for printing receipts after order completion

## Environment Variables

Required in `.env`:
```
DATABASE_URL=postgresql://...  # PostgreSQL connection string
NODE_ENV=development          # development | test | production
```

Environment variables are validated at build time using `@t3-oss/env-nextjs` in [src/env.js](src/env.js).

## Code Quality & Linting

This project uses **Ultracite** which enforces Biome rules for:
- Strict TypeScript type safety
- Accessibility standards (a11y)
- React best practices
- Code complexity limits

**Key Ultracite rules** (comprehensive list in `.github/copilot-instructions.md` and `.claude/CLAUDE.md`):
- Don't use TypeScript enums, use `as const` instead
- Use `export type` and `import type` for types
- Don't use `any` type
- All React hooks must be at top level
- Don't use Array index as keys
- Always include button `type` attribute
- Use `===` and `!==` for comparisons
- Don't use `console` (use proper logging)

## Important Notes

- **No console.log**: Ultracite/Biome forbids console usage. Remove debug statements before committing.
- **Type safety**: All components and functions should have proper TypeScript types. Avoid `any`.
- **Server actions**: Always validate inputs with Zod schemas before database operations.
- **Database operations**: Use Drizzle ORM query builder, never raw SQL strings.
- **Accessibility**: All interactive elements must have proper ARIA attributes and keyboard support.
- **Next.js Image**: Use `next/image` instead of `<img>` tags.
- **Client/Server**: Mark client components with `"use client"` and server actions with `"use server"`.
