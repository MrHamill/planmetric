---
paths:
  - "app/globals.css"
  - "app/**/*.tsx"
  - "components/**/*.tsx"
---

# Styling Rules

## Tailwind CSS v4

This project uses **Tailwind CSS v4** — the configuration is entirely inside `app/globals.css` via the `@theme` block. There is no `tailwind.config.js` file.

```css
@import "tailwindcss";

@theme {
  --color-primary: #d9c2b4;
  /* ... all tokens here */
}
```

PostCSS plugin: `"@tailwindcss/postcss": {}` in `postcss.config.mjs`. Do not add `tailwindcss` directly as a PostCSS plugin.

## Design Token System (Material Design 3)

All colors are defined as CSS custom properties in `globals.css` and used as Tailwind utility classes:

**Primary (warm taupe accent)**
- `text-primary` / `bg-primary` — `#d9c2b4`
- `text-on-primary` / `bg-on-primary` — `#4d3d33`
- `text-primary-dim` — `#cbb4a7`

**Surface layers (dark, additive lightness)**
- `bg-background` / `bg-surface` — `#0e0e0d` (base)
- `bg-surface-container-low` — `#131312`
- `bg-surface-container` — `#191a18`
- `bg-surface-container-high` — `#1f201e`
- `bg-surface-container-highest` — `#252624`

**Text**
- `text-on-surface` — `#e7e5e1`
- `text-on-surface-variant` — `#acaba7`

**Discipline colours** (use for sport-specific UI)
- `text-swim` / `bg-swim` — `#0ea5e9`
- `text-bike` / `bg-bike` — `#22c55e`
- `text-run` / `bg-run` — `#f97316`
- `text-brick` / `bg-brick` — `#a855f7`

## Typography Classes

Always use the semantic font classes, never inline `font-family`:

| Class | Font | Use for |
|---|---|---|
| `font-headline` | Epilogue | Headings, brand name, large UI text |
| `font-body` | Manrope | Paragraphs, descriptions |
| `font-label` | Inter | Labels, captions, buttons, tracking text |

## Border Radius

Use the custom radius tokens, not default Tailwind values:
- `rounded-sm` — `2px` (buttons, cards — most common)
- `rounded-lg` — `4px`
- `rounded-xl` — `8px`

## Common Patterns

**Buttons (primary)**
```tsx
className="bg-primary text-on-primary px-8 py-4 text-sm font-bold tracking-widest rounded-sm hover:opacity-90 transition-all uppercase"
```

**Buttons (secondary/surface)**
```tsx
className="bg-surface-container-high text-on-surface px-8 py-4 text-sm font-bold tracking-widest rounded-sm hover:bg-primary hover:text-on-primary transition-all uppercase"
```

**Section padding**: `py-32 px-8 md:px-24`

**Max width container**: `max-w-7xl mx-auto`

**Opacity modifiers**: Use Tailwind's `/` syntax — `text-on-surface/70`, `border-primary/20`

**Dark background literal**: `bg-[#0E0E0D]/60` for the navbar blur overlay (hex literal with opacity)

## Dark Mode

Dark mode is always-on. `color-scheme: dark` is set globally. Do not implement light/dark toggling. The `dark` class is applied to `<html>` in `layout.tsx`.

## Text Selection

Custom selection styling is defined globally:
```css
::selection {
  background-color: #d9c2b4;
  color: #4d3d33;
}
```
