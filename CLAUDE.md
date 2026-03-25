# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Rules

Modular, path-scoped rules live in `.claude/rules/` and are automatically loaded when working in matching files:

- `nextjs.md` — App Router conventions, server/client split, fonts _(app/**)_
- `api-routes.md` — Route handler patterns, env vars, Supabase/Resend/Stripe usage _(app/api/**)_
- `components.md` — Shared component conventions _(components/**)_
- `styling.md` — Tailwind v4, design tokens, typography, dark mode _(*.tsx, *.css)_
- `animations.md` — Framer Motion patterns and standard easings _(*.tsx)_
- `payments.md` — Stripe plans, checkout flow, verification _(app/api/checkout/**, app/intake/**)_
- `database.md` — Supabase schema and query patterns _(app/api/**)_
- `typescript.md` — Naming conventions, form typing, props patterns _(**/*.ts, **/*.tsx)_
- `continuous-improvement.md` — When and how to update these rules _(global)_

## Commands

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

No test suite is configured.

## Architecture

**Plan Metric** is a personalized endurance training plan service. Users fill out a multi-step intake form, pay via Stripe, and receive a custom training plan.

### Tech Stack

- **Next.js 16** (App Router) with React 19
- **Tailwind CSS v4** (PostCSS-based, no `tailwind.config.js`)
- **Framer Motion 12** for animations
- **Supabase** — database (`intake_submissions` table)
- **Stripe** — payments (one-time for Starter/Premium, subscription for Elite)
- **Resend** — transactional email

### Key User Flow

```
/ (homepage) → /intake (11-step form) → /api/checkout (Stripe session)
    → Stripe → /api/intake/verify (confirm payment, update DB, send email)
    → /intake/success
```

### Directory Structure

- `app/` — Next.js App Router pages and API routes
- `app/api/checkout/` — Creates Stripe checkout session, saves draft to Supabase
- `app/api/intake/` — Saves intake form to Supabase + sends admin email
- `app/api/intake/verify/` — Verifies Stripe payment, marks submission "paid"
- `components/` — Navbar, Footer, PageTransition (AnimatePresence), CountUp

### Data Model

Supabase table `intake_submissions`:
- `id`, `full_name`, `email`, `training_for`, `race_date`
- `status` — `"draft"` → `"pending_payment"` → `"paid"`
- `plan` — `"starter"` | `"premium"` | `"elite"`
- `data` — full JSON blob of all 50+ form fields
- `stripe_session_id`, `created_at`

### Environment Variables

Required in `.env.local`:
- `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`
- `RESEND_API_KEY`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_SITE_URL`

### Styling Notes

- Color theme defined as CSS custom properties in `app/globals.css` — dark mode with warm beige accent (`#d9c2b4`)
- Three Google Fonts via CSS variables: `--font-headline` (Epilogue), `--font-body` (Manrope), `--font-label` (Inter)
- Discipline-specific accent colors: swim (`#0ea5e9`), bike (`#22c55e`), run (`#f97316`), brick (`#a855f7`)
