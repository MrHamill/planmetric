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
  --color-primary: #A0522D;
  /* ... all tokens here */
}
```

PostCSS plugin: `"@tailwindcss/postcss": {}` in `postcss.config.mjs`. Do not add `tailwindcss` directly as a PostCSS plugin.

## Design Token System

All colors are defined as CSS custom properties in `globals.css` and used as Tailwind utility classes:

**Primary (chestnut brown accent)**
- `text-primary` / `bg-primary` — `#A0522D`
- `text-on-primary` / `bg-on-primary` — `#F0E6D4`
- `text-primary-dim` — `#6B3A2A`
- `text-secondary` — `#C4734F` (burnt sienna — eyebrow text, labels)

**Surface layers (warm cream, subtractive depth)**
- `bg-background` / `bg-surface` — `#F0E6D4` (main cream)
- `bg-surface-container-lowest` — `#F5EDE0`
- `bg-surface-container-low` — `#EDE3D0`
- `bg-surface-container` — `#E4DAC8` (cards, nav)
- `bg-surface-container-high` — `#DBD0BC` (hover)
- `bg-surface-container-highest` — `#D8CDB8` (footer)

**Text**
- `text-on-surface` — `#1C1614` (headings, near black)
- `text-on-surface-variant` — `#3A2E28` (body text, dark brown)

**Discipline colours** (use for sport-specific UI)
- `text-swim` / `bg-swim` — `#0ea5e9`
- `text-bike` / `bg-bike` — `#22c55e`
- `text-run` / `bg-run` — `#f97316`
- `text-brick` / `bg-brick` — `#a855f7`

## Typography Classes

Always use the semantic font classes, never inline `font-family`:

| Class | Font | Use for |
|---|---|---|
| `font-serif` | Playfair Display | Retro magazine headlines, hero text, section titles |
| `font-headline` | Epilogue | Navigation, tier names, metric numbers, UI headings |
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
className="bg-primary text-on-primary px-8 py-4 text-sm font-bold tracking-widest rounded-sm hover:bg-primary-dim transition-all uppercase"
```

**Buttons (secondary/surface)**
```tsx
className="bg-surface-container-high text-on-surface px-8 py-4 text-sm font-bold tracking-widest rounded-sm hover:bg-surface-container-highest transition-all uppercase"
```

**Cards**
```tsx
className="bg-surface-container rounded-sm border border-outline/18 hover:border-primary/40"
```

**Section padding**: `py-32 px-8 md:px-24`

**Max width container**: `max-w-7xl mx-auto`

**Opacity modifiers**: Use Tailwind's `/` syntax — `text-on-surface/70`, `border-primary/20`

**Navbar blur overlay**: `bg-[#E4DAC8]/92 backdrop-blur-md`

## Light Cream Theme

This is a light cream theme. `color-scheme: light` is set globally. There are NO dark/black backgrounds anywhere on the site. All surfaces use warm cream tones.

## Text Selection

Custom selection styling is defined globally:
```css
::selection {
  background-color: #A0522D;
  color: #F0E6D4;
}
```
