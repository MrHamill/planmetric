---
paths:
  - "app/api/**"
---

# Database Rules

## Supabase Table: `intake_submissions`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid (PK) | Auto-generated |
| `full_name` | text | From `formData.fullName` |
| `email` | text | From `formData.email` |
| `training_for` | text | Sport/event type |
| `race_date` | date | Nullable |
| `status` | text | `"pending_payment"` → `"paid"` → `"plan_generated"` → `"plan_sent"` |
| `plan` | text | `"starter"` \| `"premium"` \| `"elite"` |
| `data` | jsonb | Full form submission as JSON |
| `generated_plan` | text | Final stitched HTML from two-pass Claude generation (Premium/Elite only) |
| `generated_plan_part1` | text | Temporary storage for pass 1 HTML during two-pass generation. Cleared after stitching. |
| `stripe_session_id` | text | Set on payment verification |
| `created_at` | timestamptz | Auto-set |

## Insert Pattern

```typescript
const { data: submission, error } = await supabase
  .from("intake_submissions")
  .insert([{ full_name, email, training_for, race_date, status, plan, data }])
  .select("id")
  .single();
```

Always chain `.select("id").single()` when you need the auto-generated ID.

## Update Pattern

```typescript
await supabase
  .from("intake_submissions")
  .update({ status: "paid", stripe_session_id: sessionId })
  .eq("id", submissionId);
```

## Select Pattern

```typescript
const { data: submission } = await supabase
  .from("intake_submissions")
  .select("*")
  .eq("id", submissionId)
  .single();
```

## Error Handling

Check both `error` and the returned `data` before proceeding:

```typescript
if (dbError || !submission) {
  console.error("DB error:", JSON.stringify(dbError));
  return NextResponse.json({ error: "Failed to save submission", detail: dbError?.message }, { status: 500 });
}
```

## Client Instantiation

Never instantiate the Supabase client at module scope in API routes. Always create it inside the handler function. Use the service key — never the anon key — in server-side code.
