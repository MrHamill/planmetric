import Link from "next/link";
import { FadeIn, FadeInHero, HoverCard } from "@/components/FadeIn";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Journal",
  description: "Evidence-based articles on endurance training, nutrition, and race preparation. Written by coaches, backed by science.",
  openGraph: {
    title: "The Journal — Plan Metric",
    description: "Evidence-based articles on endurance training, nutrition, and race preparation.",
  },
  alternates: { canonical: "/blog" },
};

const BG = "#0F0F0F";
const TEXT = "#F5F5F0";
const DIM = "rgba(245,245,240,0.45)";
const ACCENT = "#B85C2C";
const CARD_BG = "rgba(245,245,240,0.03)";
const CARD_BORDER = "rgba(245,245,240,0.10)";
const RULE = "rgba(245,245,240,0.15)";

const catColor: Record<string, { text: string; bg: string }> = {
  Training:    { text: ACCENT, bg: "rgba(184,92,44,0.10)" },
  Swim:        { text: "#0ea5e9", bg: "rgba(14,165,233,0.10)" },
  Bike:        { text: "#22c55e", bg: "rgba(34,197,94,0.10)" },
  Run:         { text: "#f97316", bg: "rgba(249,115,22,0.10)" },
  Nutrition:   { text: "#f97316", bg: "rgba(249,115,22,0.10)" },
  Methodology: { text: "#8b5cf6", bg: "rgba(139,92,246,0.10)" },
  Triathlon:   { text: "#a855f7", bg: "rgba(168,85,247,0.10)" },
  Racing:      { text: "#ef4444", bg: "rgba(239,68,68,0.10)" },
};

const ARTICLES = [
  { title: "City2Surf 2026: the complete pacing and training guide", category: "Run", readTime: "8 min read", excerpt: "How to pace City2Surf, survive Heartbreak Hill, and build a 17-week training plan for the August 9 race. Pacing tables, course breakdown, and race day checklist.", href: "/blog/city2surf-2026-guide" },
  { title: "How to read your heart rate zones \u2014 and why most athletes ignore them", category: "Training", readTime: "6 min read", excerpt: "The five-zone system explained, why Zone 2 is chronically underused, and how to calibrate zones properly across swim, bike and run.", href: "/blog/heart-rate-zones" },
  { title: "What to eat the week before a triathlon", category: "Nutrition", readTime: "5 min read", excerpt: "From carbohydrate loading to race-morning fuelling. A day-by-day breakdown of what to eat and what to avoid.", href: "/blog/race-week-nutrition" },
  { title: "Why most training plans fail \u2014 and what to do instead", category: "Methodology", readTime: "7 min read", excerpt: "Standardised plans underperform individualised ones by half. The research behind adaptive training and the 10% rule.", href: "/blog/why-training-plans-fail" },
  { title: "Brick sessions explained \u2014 how to train your legs for the run off the bike", category: "Triathlon", readTime: "6 min read", excerpt: "What brick legs are, how many bricks you need before race day, and why your cycling cadence determines your run.", href: "/blog/brick-sessions-explained" },
  { title: "How to taper before race day without losing fitness", category: "Racing", readTime: "5 min read", excerpt: "Reduce volume, maintain intensity, and arrive at the start line sharp. The science of the pre-race taper.", href: "/blog/how-to-taper" },
];

export default function BlogPage() {
  return (
    <main style={{ background: BG, color: TEXT }} className="-mt-[72px] relative">

      {/* Grain */}
      <div
        className="pointer-events-none fixed inset-0 z-50"
        style={{
          opacity: 0.035,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />

      {/* Hero */}
      <section className="min-h-[55vh] flex flex-col justify-end px-8 md:px-24 pt-40 pb-24 relative overflow-hidden">
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          aria-hidden="true"
        >
          <span
            className="font-headline font-extrabold text-[22vw] leading-none whitespace-nowrap uppercase"
            style={{ WebkitTextStroke: "1px rgba(245,245,240,0.05)", color: "transparent" }}
          >
            JOURNAL
          </span>
        </div>

        <div className="relative z-10 max-w-3xl">
          <FadeInHero delay={0.1}>
            <span
              className="font-label text-[11px] tracking-[0.35em] uppercase block mb-6"
              style={{ color: ACCENT }}
            >
              The Journal
            </span>
          </FadeInHero>

          <FadeInHero delay={0.2}>
            <h1 className="font-headline text-[clamp(2.5rem,7vw,5rem)] font-extrabold leading-[1.05] tracking-tight mb-6">
              Insights &amp;{" "}
              <span style={{ color: ACCENT }}>methodology</span>.
            </h1>
          </FadeInHero>

          <FadeInHero delay={0.35}>
            <p
              className="font-body text-lg md:text-xl leading-relaxed max-w-xl"
              style={{ color: DIM }}
            >
              Evidence-based articles on endurance training, nutrition, and
              race preparation. Written by coaches, backed by science.
            </p>
          </FadeInHero>
        </div>
      </section>

      {/* Divider */}
      <div className="px-8 md:px-24"><div className="max-w-6xl mx-auto" style={{ height: 1, background: RULE }} /></div>

      {/* Articles */}
      <section className="py-24 md:py-32 px-8 md:px-24">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <span
              className="font-label text-[11px] tracking-[0.35em] uppercase block mb-16"
              style={{ color: DIM }}
            >
              Articles
            </span>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ARTICLES.map((article, i) => {
              const cat = catColor[article.category] || catColor.Training;
              return (
                <FadeIn key={article.title} delay={i * 0.1}>
                  <HoverCard
                    className="rounded-sm overflow-hidden group cursor-pointer flex flex-col h-full"
                    style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
                  >
                    <Link href={article.href} className="p-8 flex-1 flex flex-col" style={{ color: "inherit", textDecoration: "none" }}>
                      <div className="flex items-center gap-3 mb-6">
                        <span
                          className="font-label text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm"
                          style={{ color: cat.text, background: cat.bg }}
                        >
                          {article.category}
                        </span>
                        <span className="font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>
                          {article.readTime}
                        </span>
                      </div>
                      <h2 className="font-headline text-xl font-bold mb-4 leading-snug">
                        {article.title}
                      </h2>
                      <p className="font-body text-sm leading-relaxed flex-1" style={{ color: DIM }}>
                        {article.excerpt}
                      </p>
                      <span
                        className="font-label text-xs tracking-wider mt-6 inline-block"
                        style={{ color: ACCENT }}
                      >
                        Read article &rarr;
                      </span>
                    </Link>
                  </HoverCard>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="w-full py-10 px-8 md:px-24 flex flex-col md:flex-row justify-between items-center gap-6"
        style={{ background: BG, borderTop: `1px solid ${CARD_BORDER}` }}
      >
        <span className="font-label text-[11px] tracking-[0.3em] uppercase font-bold">Plan Metric</span>
        <div className="flex gap-8">
          {[
            ["Terms", "/terms"],
            ["Privacy", "/privacy"],
            ["Instagram", "https://www.instagram.com/planmetric"],
          ].map(([label, href]) => (
            <a key={label} href={href} className="font-label text-[10px] tracking-widest uppercase transition-colors duration-200 hover:text-white" style={{ color: DIM }}>
              {label}
            </a>
          ))}
        </div>
        <span className="font-label text-[10px] tracking-widest uppercase" style={{ color: DIM }}>&copy; 2026 Plan Metric. Precision Endurance.</span>
      </footer>
    </main>
  );
}
