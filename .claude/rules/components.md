---
paths:
  - "components/**"
---

# Component Rules

## Existing Components

- `Navbar.tsx` — Fixed nav with scroll-based backdrop blur (threshold: 100px), active link via `usePathname()`, "GET STARTED" CTA to `/intake`
- `Footer.tsx` — Static Server Component (no `"use client"`), links to `/terms`, `/privacy`, Instagram
- `PageTransition.tsx` — Wraps `children` in `AnimatePresence mode="wait"` keyed by pathname for cross-route fade
- `CountUp.tsx` — Animated number counter using `useInView` (once) + `requestAnimationFrame` with cubic ease-out

## Conventions

- Primitive/shared components live in `components/`. Page-specific sub-components (e.g. `F`, `TextInput`, `SelectInput`) are defined at the top of the page file, **outside** the main component function, to prevent remounting.
- Only add `"use client"` to components that actually need it. `Footer` is intentionally a Server Component.
- Props typed inline as object literals — not as separate named interfaces — unless the type is reused elsewhere.
- Optional props always have default values in the function signature.

## Scroll Detection (Navbar pattern)

```typescript
useEffect(() => {
  const onScroll = () => setScrolled(window.scrollY > 100);
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}, []);
```

Always use `{ passive: true }` on scroll listeners.

## Material Icons

Icons use the Material Symbols Outlined font loaded in `layout.tsx`:

```tsx
<span className="material-symbols-outlined text-primary text-lg">check</span>
```

Do not add a separate icon library.
