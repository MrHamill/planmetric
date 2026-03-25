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
**Voice:** Quiet authority. Scientific but human. Data-driven but never cold. We don't shout — we command through precision and breathing room.

---

## 2. Colour Tokens

These are the EXACT hex values from the Tailwind config. Use them directly.

### Primary Palette
| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#D9C2B4` | Primary accent. Buttons, highlights, active nav. Sand/gold tone. |
| `primary-dim` | `#CBB4A7` | Hero accent text. Slightly muted version of primary. |
| `primary-container` | `#544439` | Dark container with primary tint. Badges, pill backgrounds. |
| `on-primary` | `#4D3D33` | Text ON primary-coloured backgrounds. Dark brown. |
| `on-primary-container` | `#E3CCBE` | Text ON primary-container backgrounds. Light warm. |

### Surface Palette (Background Layers)
| Token | Hex | Usage |
|-------|-----|-------|
| `background` / `surface` | `#0E0E0D` | THE main background. Near-black charcoal. |
| `surface-container-lowest` | `#000000` | Deepest layer. Used for founding story section. |
| `surface-container-low` | `#131312` | Slightly lifted. Metric sections, alternate sections. |
| `surface-container` | `#191A18` | Cards, data boxes, metric containers. |
| `surface-container-high` | `#1F201E` | Interactive cards, secondary buttons, lifted modules. |
| `surface-container-highest` | `#252624` | Highest surface. Overlays, tooltips. |
| `surface-variant` | `#252624` | Input backgrounds, hover states. |
| `surface-bright` | `#2B2C2A` | Brightest surface tone. Rare use. |

### Text Palette
| Token | Hex | Usage |
|-------|-----|-------|
| `on-surface` | `#E7E5E1` | Primary text. Warm off-white. NEVER use pure #FFFFFF. |
| `on-background` | `#E7E5E1` | Same as on-surface. Primary readable text. |
| `on-surface-variant` | `#ACABA7` | Secondary text. Body copy, descriptions, muted content. |
| `secondary` | `#9F9E99` | Tertiary text. Even more muted. Timestamps, metadata. |
| `outline` | `#767572` | Subtle borders (only when absolutely needed). |
| `outline-variant` | `#484845` | Ghost borders. Used at 15-30% opacity max. |

### Semantic Colours
| Token | Hex | Usage |
|-------|-----|-------|
| `error` | `#ED7F64` | Error states, validation failures. |
| `tertiary` | `#FFF2E1` | Warm highlight for special callouts. |
| `tertiary-dim` | `#F0D3A6` | Muted warm highlight. |

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

Three font families. Each has a specific role. Never mix roles.

### Font Stack
```
Epilogue  → Headlines, navigation, hero text, section titles, pricing numbers
Manrope   → Body copy, descriptions, paragraphs, form labels
Inter     → Labels, metadata, units (KM, CELSIUS, BPM), technical data, footer links
```

### Google Fonts Import
```
https://fonts.googleapis.com/css2?family=Epilogue:wght@400;500;700;800&family=Manrope:wght@400;500;600&family=Inter:wght@400;500;600&display=swap
```

### Tailwind Font Family Config
```js
fontFamily: {
  headline: ["Epilogue"],
  body: ["Manrope"],
  label: ["Inter"]
}
```

### Type Scale
| Role | Font | Size | Weight | Letter-spacing | Usage |
|------|------|------|--------|---------------|-------|
| Hero display | Epilogue | 8xl (6rem) | 800 (extrabold) | tracking-tighter | Main hero headlines only |
| Section title | Epilogue | 5xl (3rem) | 700 (bold) | tracking-tight | "Metrics that matter.", "Select your intensity." |
| Card title | Epilogue | 3xl (1.875rem) | 700 (bold) | tracking-tight | Step titles, tier names, methodology headers |
| Pricing number | Epilogue | 3xl | 700 | default | "$49", "$189", "$240" |
| Metric value | Epilogue | 5xl (3rem) | 700 | default | "180.4", "22", "42.5" |
| Body text | Manrope | lg (1.125rem) | 400 | default | Paragraphs, descriptions |
| Body secondary | Manrope | base (1rem) | 400 | default | Shorter descriptions |
| Nav links | Epilogue | sm (0.875rem) | 500/700 | tracking-tight | Navigation items (active = bold) |
| Eyebrow | Inter | 10px | 400 | tracking-[0.3em] | "PRECISION ENDURANCE", "ENGINEERED PERFORMANCE" |
| Button text | System | xs (0.75rem) | 700 | tracking-widest | "GET STARTED", "SELECT PREMIUM" |
| Unit labels | Inter | sm (0.875rem) | 400 | uppercase | "KM", "CELSIUS", "BPM", "MIN" |
| Footer links | Inter | 10px | 400 | tracking-widest | "TERMS", "PRIVACY", etc |
| Copyright | Inter | 10px | 400 | tracking-widest | Footer copyright in primary colour |

---

## 4. Layout & Spacing

### Container
- Max width: `max-w-7xl` (80rem / 1280px) for content sections
- Max width: `max-w-[1920px]` for nav bar only
- Horizontal padding: `px-8` (mobile), `px-24` (desktop)

### Section Spacing
- Between major sections: `py-32` (8rem / 128px)
- Section with background change: Use different surface token, no explicit border

### The "No-Line" Rule
**CRITICAL:** Never use visible 1px solid borders to separate content sections. Define boundaries ONLY through background colour shifts. Example: a section on `surface-container-low` (#131312) sitting on `surface` (#0E0E0D) creates a natural boundary.

**Exception:** The nav has no border. The footer has a single `border-t border-[#E7E5E1]/5` (5% opacity — barely visible). Ghost borders on interactive elements use `outline-variant` at 15% opacity.

### Border Radius
```js
borderRadius: {
  DEFAULT: "0.125rem",  // 2px — sharp, tailored. Used on buttons and cards.
  lg: "0.25rem",        // 4px — slightly softer.
  xl: "0.5rem",         // 8px — for larger containers.
  full: "0.75rem"       // 12px — for badges and pills.
}
```
**No pill-shaped buttons.** Avoid large border-radius on buttons. The brand is sharp and tailored, not soft and friendly.

---

## 5. Navigation

### Structure
```
[PLAN METRIC logo]     [HOME] [PROCESS] [METHODOLOGY] [PRICING]     [GET STARTED button]
```

### Specs
- Position: `fixed top-0 w-full z-50`
- Background: `bg-[#0E0E0D]/60 backdrop-blur-md` (glassmorphic — 60% opacity with blur)
- Padding: `px-8 py-6`
- Logo: Epilogue, `text-xl font-bold tracking-tighter uppercase` in `#E7E5E1`
- Nav links: Epilogue, `text-sm font-medium tracking-tight uppercase` in `#E7E5E1/70`
- Active link: `text-[#D9C2B4] font-bold border-b border-[#D9C2B4] pb-1`
- CTA button: `bg-primary text-on-primary px-6 py-2 text-xs font-bold tracking-widest rounded-sm uppercase`

---

## 6. Component Patterns

### Buttons
**Primary (CTA):**
```
bg-primary text-on-primary px-8 py-4 text-sm font-bold tracking-widest rounded-sm uppercase
hover:opacity-90 transition-all
```

**Secondary (Ghost):**
```
bg-surface-container-high text-on-surface px-8 py-4 text-sm font-bold tracking-widest rounded-sm uppercase
hover:bg-surface-variant transition-all
```

**Tertiary (Text link):**
```
font-label text-xs tracking-widest uppercase border-b border-primary/30 pb-1
hover:border-primary transition-colors
```

### Metric Cards
```
bg-surface p-8 rounded-sm
```
- Label: `font-label text-[10px] tracking-widest text-primary uppercase`
- Value: `font-headline text-5xl font-bold`
- Unit: `font-label text-sm text-on-surface-variant uppercase` (positioned as baseline sibling)

### Pricing Cards
- Starter/Elite: `bg-surface p-12 hover:bg-surface-container-low transition-colors duration-500`
- Premium (featured): `bg-surface-container-low p-12 border-x border-outline-variant/5`
- Tier label: `font-label text-xs tracking-widest uppercase` (primary for featured, on-surface-variant for others)
- Tier name: `font-headline text-3xl font-bold`
- Price: `font-headline text-3xl font-bold` + `font-label text-sm text-on-surface-variant`
- Features list: `flex items-center gap-3 text-sm` with Material Icons check marks in primary

### Step Cards (Process Page)
- Number circle: `w-10 h-10 rounded-full border border-primary flex items-center justify-center bg-background`
- Number text: `font-label text-primary text-xs font-bold`
- Connected by a vertical line: `w-[1px] bg-outline-variant/20`

### Image Treatment
- Default: `grayscale opacity-60`
- Hover: `grayscale-0 opacity-80 transition-all duration-700`
- Overlay: `bg-gradient-to-t from-background/80 to-transparent` on top of image
- Phase label on image: `font-label text-xs text-primary-dim uppercase tracking-widest` positioned bottom-left

### Data Boxes (Process Page)
```
p-4 bg-surface-container rounded-sm border-l-2 border-primary/40
```
- Label: `font-label text-[10px] text-primary uppercase tracking-tighter`
- Value: `font-headline text-xl font-bold` + `font-label text-[10px] font-normal` for unit

---

## 7. Page Structure

### Home Page (/)
1. Hero — full viewport, image right (60%), text left, eyebrow + headline + body + 2 CTAs
2. Metrics section — surface-container-low bg, "Metrics that matter", metric cards + image
3. Pricing tiers — 3 columns, "Select your intensity"
4. Founding story — surface-container-lowest bg, founder image + story text
5. Final CTA — centered, "Ready to evolve?"

### Process Page (/process)
1. Hero — "A Precise Path to Peak Endurance." with sidebar description
2. 3-step vertical flow — numbered circles connected by line, each with text + image
3. Final CTA block — "Ready for Precision." centered with 2 CTAs

### Methodology Page (/methodology)
1. Hero — "METHODOLOGY." with temp/VO2 data sidebar
2. 3-pillar cards — "Your Metrics, Your Life" / "Human Review" / "Precision Engineering"
3. Physiological Mapping — HR Zones, VO2 Max, Dynamic Constraints
4. Data Transformation — "FROM DATA TO DESIGN" with 4-step pipeline
5. HTML Plan Interface — features grid (Collapsible Blocks, Responsive, Legibility, Live Updates)
6. Final CTA — "READY TO BUILD YOUR PLAN?"

### Pricing Page (/pricing)
1. Hero — "Invest in Performance."
2. 3 pricing cards (Starter $49, Premium $189, Elite $240/mo)
3. Compare Tiers table
4. "Not sure where to start?" CTA with assessment link

---

## 8. Images

### Treatment
All images should be:
- Grayscale by default with reduced opacity (60-80%)
- Colour on hover with increased opacity
- Overlaid with gradient from bottom (background/80% to transparent)
- High quality, professional endurance sport photography
- Subjects: runners on trails, cyclists climbing, triathletes, coaches reviewing data

### Aspect Ratios
- Hero: Full viewport height, image covers right 60%
- Process step images: `aspect-[16/9]`
- Founder photo: `aspect-square`
- Metric section images: Fixed height `h-[400px]`

---

## 9. Responsive Behaviour

### Breakpoints (Tailwind defaults)
- Mobile: default (< 768px)
- Tablet/Desktop: `md:` (768px+)

### Key Responsive Rules
- Nav links hidden on mobile (`hidden md:flex`), burger menu needed
- Hero image goes behind text on mobile with reduced opacity
- Grid columns collapse to single column on mobile
- Pricing cards stack vertically on mobile
- Horizontal padding reduces: `px-8` mobile, `px-24` desktop
- Hero text scales: `text-5xl` mobile, `text-8xl` desktop

---

## 10. Do's and Don'ts

### DO:
- Use surface colour shifts instead of borders
- Keep all text in warm off-white (#E7E5E1), never pure white
- Use grayscale images with colour on hover
- Keep buttons sharp (2px radius), never pill-shaped
- Use generous whitespace — if a section feels full, remove something
- Put units (KM, CELSIUS, BPM) in Inter label font, visually subordinate to the number
- All navigation and button text in UPPERCASE with wide letter-spacing
- Use 60% opacity + backdrop-blur for the nav glassmorphism

### DON'T:
- Don't use pure white (#FFFFFF) anywhere
- Don't use pure black borders — only ghost borders at <15% opacity
- Don't use tech gradients (purple-to-blue, neon)
- Don't use large border-radius or pill shapes on buttons
- Don't overcrowd — this design thrives on "wasted" space
- Don't use any font outside Epilogue, Manrope, and Inter
- Don't make the nav opaque — it must be glassmorphic
- Don't use coloured backgrounds for sections — only surface token shifts

---

## 11. Tailwind Config (copy directly into tailwind.config.ts)

```js
const config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "inverse-on-surface": "#565553",
        "on-error": "#450900",
        "primary-fixed": "#f6decf",
        "on-secondary-fixed": "#403f3c",
        "background": "#0e0e0d",
        "surface-container-lowest": "#000000",
        "secondary": "#9f9e99",
        "on-secondary-container": "#c1bfba",
        "surface-container": "#191a18",
        "surface-bright": "#2b2c2a",
        "error-dim": "#ba573f",
        "surface-container-high": "#1f201e",
        "primary-container": "#544439",
        "error-container": "#7e2b17",
        "on-background": "#e7e5e1",
        "on-tertiary-fixed": "#513e1d",
        "on-primary-fixed": "#4c3c32",
        "inverse-surface": "#fcf9f6",
        "tertiary-container": "#ffe1b3",
        "tertiary-dim": "#f0d3a6",
        "secondary-fixed": "#e5e2dd",
        "on-secondary": "#20201d",
        "outline-variant": "#484845",
        "on-primary": "#4d3d33",
        "surface-tint": "#d9c2b4",
        "on-tertiary-fixed-variant": "#6f5a36",
        "tertiary": "#fff2e1",
        "primary": "#d9c2b4",
        "primary-fixed-dim": "#e8d0c2",
        "secondary-fixed-dim": "#d7d4cf",
        "error": "#ed7f64",
        "on-secondary-fixed-variant": "#5c5b58",
        "on-error-container": "#ff9b82",
        "inverse-primary": "#6d5c50",
        "surface-container-highest": "#252624",
        "on-surface-variant": "#acaba7",
        "outline": "#767572",
        "primary-dim": "#cbb4a7",
        "secondary-dim": "#9f9e99",
        "on-primary-fixed-variant": "#69584d",
        "tertiary-fixed": "#ffe1b3",
        "on-primary-container": "#e3ccbe",
        "tertiary-fixed-dim": "#f0d3a6",
        "on-surface": "#e7e5e1",
        "on-tertiary-container": "#64502d",
        "surface-container-low": "#131312",
        "surface-dim": "#0e0e0d",
        "secondary-container": "#3c3b38",
        "surface": "#0e0e0d",
        "surface-variant": "#252624",
        "on-tertiary": "#6d5935",
        // Discipline colours (for training plan sessions)
        "swim": "#0EA5E9",
        "bike": "#22C55E",
        "run": "#F97316",
        "brick": "#A855F7",
        "rest": "#6B7280",
      },
      fontFamily: {
        headline: ["Epilogue", "sans-serif"],
        body: ["Manrope", "sans-serif"],
        label: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem",
      },
    },
  },
};
```

---

## 12. File Structure for Claude Code

When building with Claude Code, create components in this order:

```
src/
  app/
    layout.tsx          ← Shared layout (nav + footer + fonts + dark class)
    page.tsx            ← Home page
    process/page.tsx    ← Process page
    methodology/page.tsx ← Methodology page
    pricing/page.tsx    ← Pricing page
  components/
    Navbar.tsx          ← Glassmorphic fixed nav
    Footer.tsx          ← Minimal footer
    HeroSection.tsx     ← Reusable hero with eyebrow + headline + body
    MetricCard.tsx      ← Label + big number + unit
    PricingCard.tsx     ← Tier name, features, price, CTA
    StepCard.tsx        ← Numbered process step with image
    DataBox.tsx         ← Small metric box with left border accent
    SectionWrapper.tsx  ← Handles surface bg colour + padding
```

Build them in this order: layout → Navbar → Footer → Home page → then remaining pages.
