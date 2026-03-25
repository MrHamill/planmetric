---
paths:
  - "app/**/*.tsx"
  - "components/**/*.tsx"
---

# Animation Rules

## Library

All animations use **Framer Motion 12**. Do not introduce any other animation library (CSS keyframes for simple transitions are fine).

## Standard Patterns

### Fade + Slide Up (most common)
```typescript
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}   // or whileInView for scroll-triggered
transition={{ duration: 0.6, ease: "easeOut" }}
```

### Scroll-Triggered (sections)
```typescript
whileInView={{ opacity: 1, y: 0 }}
initial={{ opacity: 0, y: 20 }}
viewport={{ once: true, margin: "-80px" }}
transition={{ duration: 0.6, ease: "easeOut" }}
```
Always use `once: true` — elements should not re-animate on scroll back.

### Stagger Container Pattern
```typescript
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

// Usage:
<motion.section variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
  <motion.div variants={item}>...</motion.div>
</motion.section>
```

### Hover Lift (cards)
```typescript
whileHover={{ y: -4 }}
transition={{ duration: 0.2 }}
```

### Image / Large Asset Load
```typescript
initial={{ opacity: 0, scale: 1.05 }}
animate={{ opacity: 1, scale: 1 }}
transition={{ duration: 1.2, ease: "easeOut" }}
```

### Word-by-Word Title Reveal
```typescript
{words.map((word, i) => (
  <motion.span
    key={i}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 + i * 0.2, duration: 0.6, ease: "easeOut" }}
    className="inline-block mr-[0.22em]"
  >
    {word}
  </motion.span>
))}
```

## Page Transitions

Route transitions are handled globally in `components/PageTransition.tsx` via `AnimatePresence mode="wait"`. Do not add per-page entry animations that conflict with this fade (the page itself fades in — avoid double-fading the top section).

## CountUp Component

Use `<CountUp end={number} decimals={0} duration={1500} />` for animated metric numbers. It triggers once on scroll into view. Available props: `end`, `duration`, `decimals`, `prefix`, `suffix`.

## Performance

- `viewport={{ once: true }}` is mandatory on all `whileInView` animations
- Never use `animate` for scroll-driven effects — always `whileInView`
- `transition` on hover effects should be `≤ 0.2s` to feel instant
- Use `ease: "easeOut" as const` (TypeScript requires the cast)
