---
paths:
  - "app/api/checkout/**"
  - "app/api/intake/verify/**"
  - "app/intake/**"
---

# Payments Rules

## Stripe Plans

| Plan | Price ID | Mode | Price |
|---|---|---|---|
| `starter` | `price_1TFP7aEt0xoOVcMAjQJQHEfl` | `payment` | $29.99 one-time |
| `premium` | `price_1TFP8eEt0xoOVcMAJWL3g0IF` | `payment` | $99.99 one-time |
| `elite` | `price_1TEQtrIvKrc1hDGjPQjhulVk` | `subscription` | $99/month |

Do not change price IDs without verifying they exist in the Stripe dashboard.

## Checkout Flow

1. Client POSTs `{ plan, formData }` to `/api/checkout`
2. Server saves draft to Supabase with `status: "pending_payment"` and retrieves the new `id`
3. Server creates Stripe session with `metadata: { submission_id }` so it can be looked up on verify
4. Server returns `{ url: session.url }` — client does `window.location.href = data.url`
5. Stripe redirects to `/intake/success?session_id=...` on success, or `/intake` on cancel

## Payment Verification

`/api/intake/verify` (GET with `?session_id=`):

1. Retrieve Stripe session and check `payment_status === "paid"` OR `status === "complete"`
2. Extract `session.metadata.submission_id`
3. Fetch full submission from Supabase
4. **Idempotency check**: if `submission.status === "paid"`, return early with `{ ok: true, alreadyProcessed: true }`
5. Update status to `"paid"`, set `stripe_session_id`
6. Send admin notification email
7. Return `{ ok: true, email: submission.email }`

## Success Page

`app/intake/success/page.tsx` uses `useSearchParams()` to get `session_id`, then fetches `/api/intake/verify` on mount. It has three states: loading → success (shows email) / error (shows contact fallback). Wrap in `<Suspense>` because `useSearchParams` requires it.

## Client-Side Submission

```typescript
const res = await fetch("/api/checkout", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ plan, formData: form }),
});
const data = await res.json();
if (!res.ok) throw new Error(data.detail || data.error || "failed");
if (data.url) window.location.href = data.url;
```

Error message shown to user: `"Something went wrong. Please try again or email admin@planmetric.com.au"`
