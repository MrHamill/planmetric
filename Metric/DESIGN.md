# DESIGN.md — Plan Metric
# This file is the single source of truth for all design decisions.
# Claude Code: read this file before building ANY component.

---

## 1. Brand Identity

**Name:** Plan Metric
**Tagline:** Precision Endurance
**Domain:** planmetric.com.au
**Instagram:** @planmetric

**What we are:** Personalised endurance training plans for triathletes, runners, and cyclists.
**What we are NOT:** A generic template shop. Not an app. Not a subscription platform (yet).
**Voice:** Warm authority. Scientific but human. Data-driven but never cold. Vintage editorial feel — like a premium coffee brand or lifestyle magazine.

---

## 2. Colour Tokens

These are the EXACT values from the Tailwind CSS `@theme` block in `globals.css`. Use them directly.

### Primary Palette (Warm Chestnut)
| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#A0522D` | Chestnut brown — buttons, accents, prices, badges |
| `primary-dim` / `primary-variant` | `#6B3A2A` | Darker chestnut — hover states on primary |
| `primary-container` / `secondary` | `#C4734F` | Burnt sienna — eyebrow text, labels, secondary accents |
| `on-primary` | `#F0E6D4` | Cream — text on primary-coloured backgrounds |

### Surface Palette (Warm Cream)
| Token | Hex | Usage |
|-------|-----|-------|
| `background` / `surface` | `#F0E6D4` | Main page background — warm cream |
| `surface-container-lowest` | `#F5EDE0` | Lightest surface |
| `surface-container-low` | `#EDE3D0` | Light surface, alternate sections |
| `surface-container` | `#E4DAC8` | Cards, nav background |
| `surface-container-high` | `#DBD0BC` | Hover states, active cards |
| `surface-container-highest` | `#D8CDB8` | Footer, deepest cream |

### Text Palette
| Token | Hex | Usage |
|-------|-----|-------|
| `on-surface` | `#1C1614` | Headings, strong text — near black |
| `on-background` | `#1C1614` | Same as on-surface |
| `on-surface-variant` | `#3A2E28` | Body text, paragraphs — dark brown |

### Outline
| Token | Value | Usage |
|-------|-------|-------|
| `outline` | `#A0522D` | Borders (use with opacity e.g. /18) |
| `outline-variant` | `#A0522D` | Subtle borders (use with opacity e.g. /10) |

### Discipline Colours (for training plan sessions)
| Discipline | Colour | Hex |
|-----------|--------|-----|
| Swim | Blue | `#0EA5E9` |
| Bike | Green | `#22C55E` |
| Run | Orange | `#F97316` |
| Brick | Purple | `#A855F7` |
| Rest | Gray | `#6B7280` |

---

## 3. Typography

Four font families. Each has a specific role.

### Font Stack
```
Playfair Display → Serif headlines (retro magazine feel), hero text, section titles
Epilogue  → Navigation, tier names, metric numbers, UI headings
Manrope   → Body copy, descriptions, paragraphs, form labels
Inter     → Labels, metadata, units (KM, CELSIUS, BPM), technical data, footer links
```

### Tailwind Font Family Config (in @theme block)
```css
--font-serif:    var(--font-playfair), serif;
--font-headline: var(--font-epilogue), sans-serif;
--font-body:     var(--font-manrope),  sans-serif;
--font-label:    var(--font-inter),    sans-serif;
```

### Type Scale
| Role | Font | Size | Weight | Usage |
|------|------|------|--------|-------|
| Hero display | Playfair Display | 8xl | 800 | Main hero headlines, section titles |
| Section title | Playfair Display | 5xl | 700 | "Metrics that matter.", "Select your intensity." |
| Card title | Epilogue | 3xl | 700 | Step titles, tier names |
| Pricing number | Epilogue | 3xl-5xl | 700 | "$29.99", "$99.99", "$99" — in primary colour |
| Body text | Manrope | lg | 400 | Paragraphs, descriptions |
| Eyebrow | Inter | 10px | 400 | "PRECISION ENDURANCE" |
| Button text | System | xs | 700 | "GET STARTED", "SELECT PREMIUM" |
| Unit labels | Inter | sm | 400 | "KM", "CELSIUS", "BPM" |

---

## 4. Layout & Spacing

### Container
- Max width: `max-w-7xl` (80rem / 1280px) for content sections
- Max width: `max-w-[1920px]` for nav bar only
- Horizontal padding: `px-8` (mobile), `px-24` (desktop)

### Section Spacing
- Between major sections: `py-32` (8rem / 128px)
- Alternating sections for depth: odd `bg-background`, even `bg-surface-container`

### Border Radius
```
DEFAULT: 2px — buttons, cards (sharp, tailored)
lg: 4px
xl: 8px
2xl: 12px — badges, pills
```

---

## 5. Navigation

### Structure
```
[PLAN METRIC logo]     [HOME] [PROCESS] [METHODOLOGY] [PRICING] [BLOG]     [GET STARTED button]
```

### Specs
- Position: `fixed top-0 w-full z-50`
- Background (scrolled): `bg-[#E4DAC8]/92 backdrop-blur-md`
- Logo: Epilogue, `text-xl font-bold` in `#A0522D` (primary)
- Nav links: Epilogue, `text-sm` in `#1C1614` (on-surface)
- Active link: `text-primary font-bold border-b border-primary pb-1`
- CTA button: `bg-primary text-on-primary` (chestnut + cream)

---

## 6. Component Patterns

### Buttons
**Primary (CTA):**
```
bg-primary text-on-primary px-8 py-4 text-sm font-bold tracking-widest rounded-sm uppercase
hover:bg-primary-dim transition-all
```

**Secondary (Surface):**
```
bg-surface-container-high text-on-surface px-8 py-4 text-sm font-bold tracking-widest rounded-sm uppercase
hover:bg-surface-container-highest transition-all
```

### Cards
```
bg-surface-container rounded-sm border border-outline/18 hover:border-primary/40
```

### Pricing Cards
- All cards: `bg-surface-container` with `border-outline/18`
- Featured (Premium): `border-primary/30` with "MOST SELECTED" badge
- Pricing numbers in `text-primary` (chestnut brown)
- Badges: `bg-primary text-on-primary`

### Footer
```
bg-surface-container-highest border-t border-primary/15
```
- Text: `text-on-surface-variant/60`
- Copyright: `text-primary`

---

## 7. Page Structure

### Home Page (/)
1. Hero — full viewport, image right (60%) with cream gradient overlay, serif headline + badges
2. Metrics section — `bg-surface-container`, "Metrics that matter", 3-column process overview
3. Illustration strip — `bg-surface-container-low`, placeholder illustrations
4. Pricing tiers — 3 columns, "Select your intensity"
5. Final CTA — "Ready to evolve?"

### Process Page (/process)
1. Hero — serif heading with sidebar description
2. 3-step vertical flow — numbered circles with cream-tone timeline
3. Single CTA — "START YOUR ASSESSMENT"

### Methodology Page (/methodology)
1. Hero — serif "METHODOLOGY." heading
2. 3-pillar cards on cream surfaces
3. Physiological Mapping section
4. Data Transformation section
5. HTML Plan Interface features
6. Final CTA

### Pricing Page (/pricing)
1. Hero — "Invest in Performance."
2. 3 pricing cards (Starter $29.99 → /plans, Premium $99.99 → /assessment, Elite $99/mo → /assessment)
3. Full "Compare Tiers" table (13 rows)
4. Assessment CTA

### Plans Page (/plans)
1. Hero — "Pre-built plans. Proven results."
2. Filter tabs (All / Running / Triathlon)
3. Plan cards grid by event × difficulty with Preview modal

### Blog Page (/blog)
1. Hero — "Insights & Methodology."
2. 3 featured article cards
3. More articles list
4. "Find More Articles" button

### Assessment Page (/assessment)
1. Strava Connect banner with "Coming soon" message
2. Full intake form

---

## 8. Design Principles

### DO:
- Use warm cream backgrounds — zero black backgrounds anywhere
- Use serif font (Playfair Display) for major headlines (retro magazine feel)
- Use decorative dividers between sections (diamond ornaments)
- Alternating section backgrounds for depth (cream ↔ darker cream)
- All pricing numbers in chestnut primary colour
- Include illustration placeholders for runner, cyclist, swimmer, triathlete
- Keep buttons sharp (2px radius), never pill-shaped

### DON'T:
- Don't use any dark/black backgrounds
- Don't use pure white (#FFFFFF) — use warm cream tones
- Don't use tech gradients (purple-to-blue, neon)
- Don't overcrowd — generous whitespace
- Don't make the nav opaque — use glassmorphic backdrop blur
