---
paths:
  - "app/**"
  - "next.config.ts"
---

# Next.js Rules

## ⚠️ Version Warning

This project uses **Next.js 16.2.0** — a version with breaking changes that may differ significantly from your training data. Before writing any Next.js-specific code, read the relevant guide in `node_modules/next/dist/docs/`. Heed all deprecation notices.

## App Router Conventions

- All routes live under `app/` using the App Router. No `pages/` directory exists.
- Page files are named `page.tsx`. API endpoints are named `route.ts`.
- Layout is defined in `app/layout.tsx` — it wraps all pages with `<Navbar>`, `<PageTransition>`, and `<Footer>`.
- Route handlers use `NextRequest` / `NextResponse` from `"next/server"`.

## Server vs Client Components

- Components are **Server Components by default** — only add `"use client"` when the component uses hooks, event listeners, or browser APIs.
- `app/layout.tsx` is a Server Component; it exports `metadata` and loads fonts server-side.
- All pages with animations, form state, or interactivity are Client Components (`"use client"`).

## API Route Patterns

- Request body: `await req.json()`
- Query params: `req.nextUrl.searchParams.get("key")`
- Responses: always `NextResponse.json({ ... }, { status: CODE })`
- Error status conventions: `400` bad request, `402` payment required, `404` not found, `500` server error
- Success responses return `{ ok: true }` or `{ url: string }` etc. — keep shapes consistent

## Fonts

- Three Google Fonts loaded via `next/font/google` in `layout.tsx` with CSS variable names:
  - `--font-epilogue` → `font-headline` class
  - `--font-manrope` → `font-body` class
  - `--font-inter` → `font-label` class
- Always use these font utility classes, never inline `font-family`.

## Metadata

- Static metadata is exported from `app/layout.tsx`. Page-level metadata overrides go in individual `page.tsx` files via `export const metadata`.

## Config

- `next.config.ts` is intentionally minimal. `devIndicators: false` suppresses the dev overlay. Do not add experimental flags without reading the v16 docs first.
