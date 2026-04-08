import Link from "next/link";
import { FadeIn, FadeInHero, FadeInScale, FadeInSlide, HoverCard } from "@/components/FadeIn";
import { HeroWordReveal } from "@/components/HeroWordReveal";
import { ScrollButton } from "@/components/ScrollButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plan Metric | Precision Endurance",
  description: "Personalised endurance training plans for triathletes, runners, and cyclists. Built from your biology — not a template. From $29.99.",
  openGraph: {
    title: "Plan Metric | Precision Endurance",
    description: "Personalised endurance training plans for triathletes, runners, and cyclists. Built from your biology — not a template.",
  },
  alternates: { canonical: "/" },
};

/* ─── Palette ────────────────────────────────────────────────── */
const BG = "#0F0F0F";
const TEXT = "#F5F5F0";
const DIM = "rgba(245,245,240,0.45)";
const ACCENT = "#B85C2C";
const CARD_BG = "rgba(245,245,240,0.03)";
const CARD_BORDER = "rgba(245,245,240,0.10)";

/* ─── B&W image style ────────────────────────────────────────── */
const bwImg: React.CSSProperties = {
  filter: "grayscale(100%)",
  objectFit: "cover" as const,
  width: "100%",
  height: "100%",
  position: "absolute" as const,
  inset: 0,
};

/* ─── Steps data ──────────────────────────────────────────────── */
const STEPS = [
  {
    num: "01",
    title: "Pick Your Plan",
    body: "Choose your discipline and level \u2014 Running, Triathlon, or Cycling.",
  },
  {
    num: "02",
    title: "Complete Your Intake",
    body: "An 8\u201310 minute deep-dive into your fitness, goals, schedule, and injury history.",
  },
  {
    num: "03",
    title: "Receive Your Plan",
    body: "Within 48 hours, your personalised HTML plan lands in your inbox. No PDFs. No spreadsheets.",
  },
  {
    num: "04",
    title: "Execute the Race",
    body: "Show up to race day with a plan built for exactly you \u2014 and nothing left to chance.",
  },
];

/* ─── Plan cards data ─────────────────────────────────────────── */
const PLANS = [
  {
    name: "STARTER",
    price: "$29.99",
    freq: "one-time",
    body: "Pre-built plans for proven milestones.",
    cta: "Browse Plans",
    featured: false,
  },
  {
    name: "PREMIUM",
    price: "$99.99",
    freq: "one-time",
    body: "Fully personalised to your exact data and race.",
    cta: "Select Premium",
    featured: true,
  },
  {
    name: "ELITE",
    price: "$99",
    freq: "/month",
    body: "Dynamic monthly adjustments with 1:1 coaching.",
    cta: "Sold Out",
    featured: false,
    soldOut: true,
  },
];

/* ─── Differentiators data ───────────────────────────────────── */
const DIFFERENTIATORS = [
  {
    title: "vs. Training Platforms",
    body: "TrainingPeaks and Intervals.icu give you tools \u2014 not a plan. You still build it yourself. We do the building.",
  },
  {
    title: "vs. Algorithm Apps",
    body: "TrainerRoad and Zwift offer structured workouts, but they\u2019re one-size-fits-all. No adaptation to your life, injuries, or race date.",
  },
  {
    title: "vs. Hiring a Coach",
    body: "A coach costs $200\u2013400/month. We deliver the same personalised, race-specific plan \u2014 once \u2014 for $99.99.",
  },
];

/* ─── JSON-LD ────────────────────────────────────────────────── */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Plan Metric",
  url: "https://planmetric.com.au",
  description: "Personalised endurance training plans for triathletes, runners, and cyclists.",
  sameAs: ["https://www.instagram.com/planmetric"],
};

/* ═══════════════════════════════════════════════════════════════ */
export default function HomePage() {
  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <main style={{ background: BG, color: TEXT }} className="-mt-[72px]">

      {/* ───────────────── SECTION 1 — HERO ───────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
        <img
          src="/images/bike-motion-blur.jpeg"
          alt=""
          aria-hidden="true"
          style={bwImg}
        />
        <div
          className="absolute inset-0"
          style={{ background: "rgba(0,0,0,0.65)" }}
        />

        <div className="relative z-10 px-8 md:px-24 max-w-4xl pt-28">
          <FadeInHero delay={0.1}>
            <span
              className="font-label text-[11px] tracking-[0.35em] uppercase block mb-8"
              style={{ color: ACCENT }}
            >
              Precision Endurance
            </span>
          </FadeInHero>

          <h1 className="font-headline text-[clamp(2.8rem,8vw,6rem)] font-extrabold leading-[1.05] tracking-tight mb-8">
            <HeroWordReveal />
          </h1>

          <FadeInHero delay={0.95}>
            <p
              className="font-body text-lg md:text-xl leading-relaxed max-w-xl mb-5"
              style={{ color: "rgba(245,245,240,0.75)" }}
            >
              Personalised endurance training plans for triathletes, cyclists and
              runners. Built from your biology&nbsp;&mdash; not a template.
            </p>
          </FadeInHero>

          <FadeInHero delay={1.15}>
            <p
              className="font-label text-xs tracking-wider mb-12"
              style={{ color: DIM }}
            >
              All levels. All disciplines. From $29.99.
            </p>
          </FadeInHero>

          <FadeInScale delay={1.3} className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/pricing"
              className="inline-block font-label text-sm font-bold tracking-widest uppercase px-10 py-4 rounded-sm transition-transform duration-200 hover:scale-[1.02]"
              style={{ background: ACCENT, color: TEXT }}
            >
              Start Your Plan &rarr;
            </Link>
            <Link
              href="/plans"
              className="inline-block font-label text-sm font-bold tracking-widest uppercase px-10 py-4 rounded-sm transition-all duration-200 hover:scale-[1.02]"
              style={{ border: `1px solid ${CARD_BORDER}`, color: TEXT }}
            >
              Try a Free 5K Plan
            </Link>
          </FadeInScale>
        </div>

        <ScrollButton targetId="process" />
      </section>

      {/* ───────────── SECTION 2 — HOW IT WORKS ───────────── */}
      <section id="process" className="relative py-32 md:py-44 overflow-hidden">
        <img
          src="/images/run-motion-blur.jpeg"
          alt=""
          aria-hidden="true"
          style={bwImg}
        />
        <div
          className="absolute inset-0"
          style={{ background: "rgba(0,0,0,0.80)" }}
        />

        <div className="relative z-10 px-8 md:px-24 max-w-6xl mx-auto">
          <FadeIn>
            <span
              className="font-label text-[11px] tracking-[0.35em] uppercase block mb-16"
              style={{ color: ACCENT }}
            >
              How It Works
            </span>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14 lg:gap-10">
            {STEPS.map((step, i) => (
              <FadeIn key={step.num} delay={i * 0.15}>
                <span
                  className="font-headline text-5xl font-extrabold block mb-4"
                  style={{ color: "rgba(245,245,240,0.06)" }}
                >
                  {step.num}
                </span>
                <h3 className="font-headline text-lg font-bold mb-3">
                  {step.title}
                </h3>
                <p className="font-body text-sm leading-relaxed" style={{ color: DIM }}>
                  {step.body}
                </p>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.3}>
            <p
              className="font-headline text-xl md:text-2xl font-bold mt-20 max-w-2xl mx-auto text-center leading-relaxed tracking-tight"
              style={{ color: "rgba(245,245,240,0.65)" }}
            >
              Built from your data, your lifestyle, your schedule, your
              goals. This plan is made for you&nbsp;&mdash; not anyone else.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ──────────── SECTION 3 — METHODOLOGY TEASER ──────── */}
      <section className="relative py-32 md:py-44 overflow-hidden" style={{ background: BG }}>
        <div className="relative z-10 px-8 md:px-24 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">

          <div className="flex-1 max-w-xl">
            <FadeIn>
              <span
                className="font-label text-[11px] tracking-[0.35em] uppercase block mb-10"
                style={{ color: DIM }}
              >
                Our Methodology
              </span>
            </FadeIn>

            <FadeIn delay={0.05}>
              <h2 className="font-headline text-3xl md:text-4xl font-bold leading-snug mb-8">
                No templates.{"\n"}No guesswork.{"\n"}Built from your{" "}
                <span style={{ color: ACCENT }}>biology</span>.
              </h2>
            </FadeIn>

            <FadeIn delay={0.1}>
              <p
                className="font-body text-base leading-relaxed mb-8"
                style={{ color: DIM }}
              >
                We analyse your heart rate zones, training history, injury data,
                and race date to engineer a plan that adapts to your
                life&nbsp;&mdash; not the other way around. Every block is
                reviewed by a human coach before delivery.
              </p>
            </FadeIn>

            <FadeIn delay={0.15}>
              <Link
                href="/methodology"
                className="font-label text-sm tracking-wider underline underline-offset-4 transition-colors duration-200"
                style={{ color: ACCENT }}
              >
                Read more &rarr;
              </Link>
            </FadeIn>
          </div>

          <FadeInSlide className="hidden md:block flex-1 relative h-[500px] max-w-[45%]">
            <img
              src="/images/ocean-exit.png"
              alt="Swimmer exiting the ocean"
              className="w-full h-full object-cover rounded-sm"
              style={{ filter: "grayscale(100%)" }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to right, ${BG} 0%, transparent 40%)`,
              }}
            />
          </FadeInSlide>
        </div>
      </section>

      {/* ──────────────── SECTION 3.5 — HOW WE'RE DIFFERENT ── */}
      <section className="py-32 md:py-44 px-8 md:px-24" style={{ background: BG }}>
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <span
              className="font-label text-[11px] tracking-[0.35em] uppercase block mb-6"
              style={{ color: DIM }}
            >
              Why Plan Metric
            </span>
          </FadeIn>
          <FadeIn delay={0.05}>
            <h2 className="font-headline text-3xl md:text-5xl font-bold mb-16">
              How we&rsquo;re{" "}
              <span style={{ color: ACCENT }}>different</span>.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DIFFERENTIATORS.map((d, i) => (
              <FadeIn key={d.title} delay={i * 0.15}>
                <HoverCard
                  tag="div"
                  className="p-10 rounded-sm flex flex-col h-full"
                  style={{
                    background: CARD_BG,
                    border: `1px solid ${CARD_BORDER}`,
                  }}
                >
                  <h3 className="font-headline text-lg font-bold tracking-wide mb-4">
                    {d.title}
                  </h3>
                  <p
                    className="font-body text-sm leading-relaxed"
                    style={{ color: DIM }}
                  >
                    {d.body}
                  </p>
                </HoverCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────── SECTION 4 — THE PLANS ───────────── */}
      <section className="relative overflow-hidden">
        <div className="relative h-[300px] md:h-[400px]">
          <img
            src="/images/transition-overhead.png"
            alt=""
            aria-hidden="true"
            style={bwImg}
          />
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.75)" }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-40"
            style={{ background: `linear-gradient(to bottom, transparent, ${BG})` }}
          />

          <div className="absolute inset-0 z-10 flex flex-col justify-end px-8 md:px-24 pb-16 max-w-6xl mx-auto w-full">
            <FadeIn>
              <span
                className="font-label text-[11px] tracking-[0.35em] uppercase block mb-6"
                style={{ color: DIM }}
              >
                The Plans
              </span>
            </FadeIn>
            <FadeIn delay={0.05}>
              <h2 className="font-headline text-3xl md:text-5xl font-bold">
                Three levels. One{" "}
                <span style={{ color: ACCENT }}>standard</span>.
              </h2>
            </FadeIn>
          </div>
        </div>

        <div className="px-8 md:px-24 pb-32 md:pb-44 pt-12" style={{ background: BG }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {PLANS.map((plan, i) => (
              <FadeIn key={plan.name} delay={i * 0.2}>
                <HoverCard
                  tag="div"
                  className="relative p-10 rounded-sm flex flex-col h-full"
                  style={{
                    background: CARD_BG,
                    border: plan.featured
                      ? `1px solid ${ACCENT}`
                      : `1px solid ${CARD_BORDER}`,
                  }}
                >
                  {plan.featured && (
                    <span
                      className="absolute -top-3 left-1/2 -translate-x-1/2 font-label text-[10px] tracking-widest uppercase px-4 py-1 rounded-sm"
                      style={{ background: ACCENT, color: TEXT }}
                    >
                      Most Selected
                    </span>
                  )}

                  <h3 className="font-headline text-xl font-bold tracking-wide mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-6">
                    <span className="font-headline text-3xl font-bold">
                      {plan.price}
                    </span>
                    <span className="font-label text-xs ml-2" style={{ color: DIM }}>
                      {plan.freq}
                    </span>
                  </div>
                  <p
                    className="font-body text-sm leading-relaxed mb-10 flex-1"
                    style={{ color: DIM }}
                  >
                    {plan.body}
                  </p>
                  {plan.soldOut ? (
                    <span
                      className="block w-full text-center font-label text-xs font-bold tracking-widest uppercase py-3 rounded-sm opacity-40 cursor-default"
                      style={{ border: `1px solid ${CARD_BORDER}`, color: TEXT }}
                    >
                      {plan.cta}
                    </span>
                  ) : (
                    <Link
                      href="/pricing"
                      className="block w-full text-center font-label text-xs font-bold tracking-widest uppercase py-3 rounded-sm transition-all duration-200 hover:scale-[1.02]"
                      style={
                        plan.featured
                          ? { background: ACCENT, color: TEXT }
                          : { border: `1px solid ${CARD_BORDER}`, color: TEXT }
                      }
                    >
                      {plan.cta}
                    </Link>
                  )}
                </HoverCard>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.3} className="text-center mt-14">
            <Link
              href="/pricing"
              className="inline-block font-label text-xs font-bold tracking-widest uppercase px-10 py-3 rounded-sm transition-all duration-200 hover:scale-[1.02]"
              style={{ border: `1px solid ${CARD_BORDER}`, color: TEXT }}
            >
              Compare All Plans &rarr;
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ──────────────── SECTION 5 — FINAL CTA ──────────── */}
      <section className="relative py-32 md:py-44 overflow-hidden">
        <img
          src="/images/swim-motion-blur.jpeg"
          alt=""
          aria-hidden="true"
          style={bwImg}
        />
        <div
          className="absolute inset-0"
          style={{ background: "rgba(0,0,0,0.75)" }}
        />

        <div className="relative z-10 text-center px-8">
          <FadeIn>
            <h2 className="font-headline text-4xl md:text-5xl font-bold mb-6">
              Ready to{" "}
              <span style={{ color: ACCENT }}>evolve</span>?
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p
              className="font-body text-base mb-12"
              style={{ color: DIM }}
            >
              Tell us about your goals, your schedule, and your race.
              It takes about 10 minutes &mdash; and it&rsquo;s where your plan starts.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <Link
              href="/pricing"
              className="inline-block font-label text-sm font-bold tracking-widest uppercase px-10 py-4 rounded-sm transition-transform duration-200 hover:scale-[1.02]"
              style={{ background: ACCENT, color: TEXT }}
            >
              Start Your Assessment &rarr;
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ───────────────────── FOOTER ─────────────────────── */}
      <footer
        className="w-full py-10 px-8 md:px-24 flex flex-col md:flex-row justify-between items-center gap-6"
        style={{ background: BG, borderTop: `1px solid ${CARD_BORDER}` }}
      >
        <span className="font-label text-[11px] tracking-[0.3em] uppercase font-bold">
          Plan Metric
        </span>

        <div className="flex gap-8">
          {[
            ["About", "/about"],
            ["Plans", "/plans"],
            ["Terms", "/terms"],
            ["Privacy", "/privacy"],
            ["Instagram", "https://www.instagram.com/planmetric"],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="font-label text-[10px] tracking-widest uppercase transition-colors duration-200 hover:text-white"
              style={{ color: DIM }}
            >
              {label}
            </Link>
          ))}
        </div>

        <span className="font-label text-[10px] tracking-widest uppercase" style={{ color: DIM }}>
          &copy; 2026 Plan Metric. Precision Endurance.
        </span>
      </footer>
    </main>
    </>
  );
}
