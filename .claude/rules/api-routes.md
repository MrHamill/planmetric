---
paths:
  - "app/api/**"
---

# API Route Rules

## Route Files

All API routes are under `app/api/`:
- `app/api/generate-plan/route.ts` — POST: pass 1 of two-pass plan generation. Generates header + zones + first half of weeks, saves to `generated_plan_part1`, fires off `/api/generate-plan/continue`
- `app/api/generate-plan/continue/route.ts` — POST: pass 2 of plan generation. Generates remaining weeks + race day + footer, stitches with pass 1, injects CSS server-side, validates all weeks present, saves final plan to `generated_plan`, emails admin review link
- `app/api/approve-plan/route.ts` — POST: sends stored generated plan to athlete + updates status to "plan_sent"
- `app/api/admin/review/route.ts` — GET: fetches submission+plan for admin review; PATCH: saves edited plan HTML
- `app/api/checkout/route.ts` — POST: creates Stripe session + saves draft to Supabase
- `app/api/intake/route.ts` — POST: saves intake form + sends admin email
- `app/api/intake/verify/route.ts` — GET: verifies Stripe payment, marks submission "paid"
- `app/api/deliver-starter-plan/route.ts` — POST: reads pre-built HTML from public/plans/, emails to athlete

## Supabase Client

Always instantiate per-request — never at module scope:

```typescript
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);
```

Use the service key (not the anon key) in API routes. Never expose `SUPABASE_SERVICE_KEY` to the client.

## Stripe Client

The Stripe client **is** safe to instantiate at module scope:

```typescript
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
```

- Starter and Premium use `mode: "payment"` (one-time)
- Elite uses `mode: "subscription"`
- Price IDs are hardcoded in `PRICE_IDS` — do not move them to env vars without updating the checkout route

## Submission Status Lifecycle

`intake_submissions.status` flows:
- Starter: `"pending_payment"` → `"paid"` → `"plan_sent"` (auto-delivered)
- Premium/Elite: `"pending_payment"` → `"paid"` → `"plan_generated"` → `"plan_sent"` (admin reviews first)

- `/api/checkout` sets `"pending_payment"` when saving the draft
- `/api/intake/verify` checks for existing `"paid"` status to prevent double-processing before updating
- `/api/generate-plan` runs pass 1, stores partial HTML in `generated_plan_part1`, then fires off `/api/generate-plan/continue`
- `/api/generate-plan/continue` stitches passes, injects CSS, validates weeks, sets `"plan_generated"` + stores final HTML in `generated_plan`
- `/api/approve-plan` sets `"plan_sent"` after admin approves and plan is emailed to athlete

## Error Handling Philosophy

- `/api/intake` (free form save): collect errors in an array but **always return 200** — a DB or email failure should not block the athlete
- `/api/checkout` and `/api/intake/verify`: return proper error status codes, as failures here affect the payment flow
- Log errors with `console.error()` before returning; include the `dbError?.message` in the response `detail` field for debuggability

## Dynamic Imports

Use dynamic imports for heavy dependencies only where needed to reduce cold-start time:

```typescript
const { createClient } = await import("@supabase/supabase-js");
const { sendEmail } = await import("@/lib/email");
```

Static imports are fine for Stripe (already at module scope).

## Environment Variables

| Variable | Usage |
|---|---|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Service role key — server only |
| `RESEND_API_KEY` | Resend email API key |
| `STRIPE_SECRET_KEY` | Stripe server SDK |
| `NEXT_PUBLIC_SITE_URL` | Used in Stripe success/cancel redirect URLs |

Always use non-null assertion (`!`) for env vars — they're expected to be set in all environments.

## Email

- Emails sent via Resend API from `"Plan Metric <pete@planmetric.com.au>"` — domain verified on Resend
- Shared `sendEmail()` helper in `lib/email.ts` — Resend client is lazily instantiated to avoid build-time errors
- HTML emails use inline styles for email client compatibility

## Plan Validation

- `lib/validate-plan.ts` — Post-generation validation with 19 rules (9 critical, 7 warning, 3 masters-only)
- Runs after final plan stitching in `/api/generate-plan/continue`
- Results shown in admin review email with red (critical) / yellow (warning) highlights
- Never blocks email delivery — admin can manually fix via review page
