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
- `research.md` — Research content processing, formatting, and file routing _(docs/research/**)_
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
- **Nodemailer + GoDaddy SMTP** — transactional email (shared helper in `lib/email.ts`)
- **Anthropic SDK** — Claude Sonnet for AI plan generation (Premium/Elite)

### Key User Flow

```
/ (homepage) → /intake (11-step form) → /api/checkout (Stripe session)
    → Stripe → /api/intake/verify (confirm payment, update DB, send email)
    → /intake/success

Post-payment plan delivery (fire-and-forget from verify):
  Starter:       → /api/deliver-starter-plan (emails static HTML from public/plans/)
  Premium/Elite: → /api/generate-plan (pass 1: first half of weeks)
                   → /api/generate-plan/continue (pass 2: remaining weeks, stitch, inject CSS, validate, email admin)
```

### API Routes

- `/api/checkout` — POST: creates Stripe session + saves draft to Supabase
- `/api/intake` — POST: saves intake form to Supabase + sends admin email
- `/api/intake/verify` — GET: verifies Stripe payment, marks submission "paid", triggers plan delivery
- `/api/generate-plan` — POST: pass 1 — generates header + zones + first half of weeks via Claude API, saves to `generated_plan_part1`, fires off continue route
- `/api/generate-plan/continue` — POST: pass 2 — generates remaining weeks + race day + footer, stitches with pass 1, injects CSS server-side, validates all weeks present, emails admin review link
- `/api/deliver-starter-plan` — POST: reads pre-built HTML from `public/plans/{event}-{level}.html`, wraps in email template, sends to athlete

### Plan Delivery Architecture

Plans are always personalised from purchase date to race date (never preset lengths).

- **Starter plans** — Pre-built static HTML files in `public/plans/` (24 files covering 5K through Ironman at beginner/intermediate/elite levels). Auto-delivered to the customer immediately.
- **Premium/Elite plans** — Generated on-demand by Claude via a **two-pass system** to prevent missing weeks. Pass 1 generates header + zones + first half of weeks. Pass 2 generates remaining weeks + race day + footer. The passes are stitched server-side, CSS is injected (not in the Claude prompt), and all weeks are validated. The generate-plan route flattens all 50+ form fields into readable text for Claude. Delivered to admin first for review before forwarding to athlete.

### Intake Form

`app/intake/page.tsx` — 11-step Client Component form with adaptive visibility based on sport selection (triathlon shows swim/bike sections, cycling hides swim, etc.). Uses a flat `FD` interface with 50+ fields. Primitive sub-components (`F`, `TextInput`, `SelectInput`, `Checkbox`, `MultiSelect`, `InfoBox`) are defined outside the main component to prevent remounting.

### Data Model

Supabase table `intake_submissions`:
- `id`, `full_name`, `email`, `training_for`, `race_date`
- `status` — `"pending_payment"` → `"paid"` → `"plan_sent"`
- `plan` — `"starter"` | `"premium"` | `"elite"`
- `data` — full JSON blob of all 50+ form fields
- `stripe_session_id`, `created_at`

### Environment Variables

Required in `.env.local`:
- `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`
- `SMTP_USER`, `SMTP_PASS` (GoDaddy email credentials)
- `STRIPE_SECRET_KEY`
- `ANTHROPIC_API_KEY`
- `NEXT_PUBLIC_SITE_URL`

### Styling Notes

- Color theme defined as CSS custom properties in `app/globals.css` — dark mode with warm beige accent (`#d9c2b4`)
- Three Google Fonts via CSS variables: `--font-headline` (Epilogue), `--font-body` (Manrope), `--font-label` (Inter)
- Discipline-specific accent colors: swim (`#0ea5e9`), bike (`#22c55e`), run (`#f97316`), brick (`#a855f7`)
- Static plan HTML files use a separate cream palette (`#F0E6D4` background, `#A0522D` accent) with inline styles for email compatibility
