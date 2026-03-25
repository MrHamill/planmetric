---
paths:
  - "**/*.ts"
  - "**/*.tsx"
---

# TypeScript Rules

## Configuration

- `strict: true` is enabled — no implicit any, strict null checks apply
- Path alias `@/*` maps to the project root — always use `@/components/...`, `@/app/...` etc.
- Target: ES2017; module resolution: bundler

## Naming Conventions

| Thing | Convention | Examples |
|---|---|---|
| Components | PascalCase | `IntakePage`, `CountUp`, `TextInput` |
| Functions/handlers | camelCase verb-first | `handleSubmit`, `upd`, `renderSection` |
| State setters | `set` prefix | `setStep`, `setForm`, `setSubmitting` |
| Boolean flags | `is`/`has`/`show` prefix | `isTri`, `hasInjury`, `showTarget` |
| Module constants | UPPER_SNAKE | `INIT`, `PLANS`, `META`, `TRIATHLON` |
| Abbreviations | Allowed for locals | `v` (value), `p` (prev state), `k` (key) |

## Form State Typing

The intake form uses a comprehensive flat interface with all fields:

```typescript
interface FD {
  fullName: string;
  email: string;
  // ... all fields as strings (even numbers/dates stored as strings)
  preferredTimes: string[];   // multi-select arrays
  maxHRUnknown: boolean;      // "I don't know" checkbox flags
}
```

The generic updater pattern:
```typescript
function upd<K extends keyof FD>(k: K, v: FD[K]) {
  setForm(p => ({ ...p, [k]: v }));
}
```

## Props Typing

- Inline object literal types for props — no separate interface unless the type is reused across files
- `React.ReactNode` for component children
- Default values in the function signature, not a separate `defaultProps`

```typescript
function TextInput({ value, onChange, type = "text", placeholder = "" }: {
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) { ... }
```

## Lookup Tables

Use `Record<K, V>` for static lookup tables:

```typescript
const META: Record<number, { num: string; title: string; sub: string }> = { ... }
const PRICE_IDS: Record<string, string> = { ... }
```

## Environment Variables

Use non-null assertion on `process.env.*`:

```typescript
process.env.STRIPE_SECRET_KEY!
process.env.SUPABASE_URL!
```

## Ease Literal Fix

Framer Motion requires string literals for `ease` — cast to avoid TS errors:

```typescript
transition={{ ease: "easeOut" as const }}
```
