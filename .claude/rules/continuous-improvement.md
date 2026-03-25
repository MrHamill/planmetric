# Continuous Improvement of Rules

This codebase evolves over time. Rules in `.claude/rules/` must stay in sync with the actual code.

## When to Update Rules

**Add or update a rule when:**
- A new third-party service or library is integrated (add a new rule file or update the relevant existing one)
- A new architectural pattern is established (document it where it lives — e.g. a new shared component pattern goes in `components.md`)
- An existing rule is found to conflict with how the code actually works
- A new page, route, or major feature is added that introduces conventions worth capturing
- A dependency is upgraded with breaking changes (especially Next.js — update `nextjs.md`)

**Remove or amend a rule when:**
- A pattern it describes no longer exists in the codebase
- A library it references has been swapped out
- The rule causes Claude to produce incorrect or outdated code

## How to Update Rules

1. Edit the relevant file in `.claude/rules/` directly — match the section structure already there
2. If adding a new concern that spans multiple files, create a new `<topic>.md` rule file with a `paths:` frontmatter block scoped to the relevant files
3. If removing a service entirely (e.g. swapping Resend for another email provider), remove or replace the relevant rule file and update references in `api-routes.md`
4. Keep rules concise — they should describe *how this codebase works*, not general best practices

## Rule File Inventory

| File | Scope | Covers |
|---|---|---|
| `nextjs.md` | `app/**` | App Router, server/client components, fonts, config |
| `api-routes.md` | `app/api/**` | Route handler patterns, env vars, email, error handling |
| `components.md` | `components/**` | Shared component conventions, scroll detection, icons |
| `styling.md` | `*.tsx`, `*.css` | Tailwind v4, design tokens, typography, dark mode |
| `animations.md` | `*.tsx` | Framer Motion patterns, standard easings, CountUp |
| `payments.md` | `app/api/checkout/**`, `app/intake/**` | Stripe plans, checkout flow, verify, success page |
| `database.md` | `app/api/**` | Supabase schema, insert/update/select patterns |
| `typescript.md` | `**/*.ts`, `**/*.tsx` | Naming conventions, form typing, props patterns |
| `continuous-improvement.md` | (global) | This file — meta-rules for maintaining rules |

## Signs a Rule Is Stale

- It references a file path that no longer exists
- It mentions a package version that has since been upgraded
- It describes a pattern that was refactored away
- It contradicts code you can see when reading the actual files
