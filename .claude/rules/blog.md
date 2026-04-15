---
paths:
  - app/blog/**
description: Rules for writing blog posts — structure, SEO, styling, and checklist
---

# Blog Post Rules

## File Structure

Each blog post lives in `app/blog/<slug>/page.tsx` as a Client Component (`"use client"` only if animations or interactivity are used — most posts need it for FadeIn).

## Required SEO Metadata

Every blog post MUST include:

1. **Next.js metadata export:**
   ```typescript
   export const metadata: Metadata = {
     title: "...",
     description: "...",                          // 150-160 chars, includes target keyword
     openGraph: { title: "...", description: "...", type: "article" },
     alternates: { canonical: "/blog/<slug>" },
   };
   ```

2. **ArticleJsonLd structured data** (always):
   ```tsx
   <ArticleJsonLd title="..." description="..." slug="<slug>" datePublished="YYYY-MM-DD" />
   ```

3. **FaqJsonLd structured data** (required on every post — Google FAQ rich results):
   ```tsx
   const faq = [
     { q: "Question matching a 'People Also Ask' query?", a: "Concise 2-3 sentence answer." },
     // 3-5 FAQs per post
   ];
   <FaqJsonLd items={faq} />
   ```
   - FAQ questions should target real "People Also Ask" queries from Google
   - Answers should be concise (2-3 sentences) and directly answer the question
   - Each FAQ answer should naturally reference Plan Metric where relevant

## Dark Theme Constants

Every blog post uses the same color constants (copy from any existing post):

```typescript
const BG = "#0F0F0F";
const TEXT = "#F5F5F0";
const DIM = "rgba(245,245,240,0.45)";
const ACCENT = "#B85C2C";
const CARD_BORDER = "rgba(245,245,240,0.10)";
const CARD_BG = "rgba(245,245,240,0.03)";
const RULE = "rgba(245,245,240,0.15)";
```

## Layout Structure

```tsx
<main style={{ background: BG, color: TEXT }} className="-mt-[72px] relative">
  {/* Grain overlay */}
  <article className="pt-40 pb-32 px-8 md:px-24">
    <div className="max-w-2xl mx-auto">
      <FadeInHero>
        {/* Back link, category badge, read time, H1 */}
      </FadeInHero>
      <div className="space-y-8 font-body text-base leading-relaxed" style={{ color: "rgba(245,245,240,0.8)" }}>
        <FadeIn delay={0.1}>{/* content sections */}</FadeIn>
      </div>
    </div>
  </article>
</main>
```

## Hero Section

1. Back link: `<Link href="/blog">` with `font-label text-[10px] tracking-widest uppercase`
2. Category badge: one of `Training`, `Nutrition`, `Racing`, `Methodology`, `Swim`, `Bike`, `Run`, `Triathlon`
3. Read time estimate: `"X min read"`
4. H1: `font-headline text-3xl md:text-5xl font-extrabold leading-tight tracking-tight`
   - Use `<span style={{ color: ACCENT }}>` to highlight one key word

## Content Patterns

- Wrap each content block in `<FadeIn delay={N}>` with incrementing delays (0.1, 0.12, 0.14, ...)
- H2 headings: `font-headline text-xl md:text-2xl font-bold mb-4 mt-12`
- Tables: styled with `CARD_BORDER` border and `DIM` header text
- Horizontal rules: `<hr style={{ border: "none", borderTop: \`1px solid ${RULE}\` }} className="my-12" />`
- Internal links: always link to relevant pages (`/intake`, `/plans`, other blog posts)
- CTA: end with a natural call-to-action linking to `/intake` or `/plans`

## Fonts

- `font-headline` (Epilogue) — H1, H2, category badges
- `font-body` (Manrope) — body paragraphs
- `font-label` (Inter) — back link, category badge text, read time, table headers

## Post-Creation Checklist

After creating the blog post file, you MUST also:

1. **Add to blog index** — add entry to the `ARTICLES` array in `app/blog/page.tsx`:
   ```typescript
   { title: "...", category: "Training", readTime: "X min read", excerpt: "...", href: "/blog/<slug>" }
   ```

2. **Add to sitemap** — add the slug to the `blogPosts` array in `app/sitemap.ts`

3. **Build test** — run `npm run build` to verify no TypeScript or rendering errors

## Content Guidelines

- All units must be metric (km, m, kg, g, mL, L) — never imperial
- Research-backed claims should reference specific numbers/protocols from `docs/research/`
- Never fabricate statistics or cite sources that don't exist in the research folder
- Write in an authoritative but approachable tone — coach speaking to an athlete
- Target 1,200-2,000 words per post (6-10 min read)
- Include at least one table or structured data element per post
- Naturally weave in internal links to `/intake`, `/plans`, `/methodology`, and other blog posts
