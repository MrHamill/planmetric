"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/* ─── Palette (matches homepage) ─────────────────────────────── */
const BG = "#0F0F0F";
const TEXT = "#F5F5F0";
const DIM = "rgba(245,245,240,0.45)";
const ACCENT = "#B85C2C";
const CARD_BG = "rgba(245,245,240,0.03)";
const CARD_BORDER = "rgba(245,245,240,0.10)";
const RULE = "rgba(245,245,240,0.15)";

/* ─── Animation presets ──────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.5, ease: "easeOut" as const, delay },
});

/* ─── Section divider ────────────────────────────────────────── */
function Divider() {
  return (
    <div className="px-8 md:px-24">
      <div className="max-w-6xl mx-auto" style={{ height: 1, background: RULE }} />
    </div>
  );
}

/* ─── Scramble text component ────────────────────────────────── */
function ScrambleText({ text, className, style, duration = 3000, delay = 0 }: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  duration?: number;
  delay?: number;
}) {
  const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*<>{}[]=/\\|";
  const DURATION = duration;
  const [displayed, setDisplayed] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const hasRun = useRef(false);

  useEffect(() => {
    if (!inView || hasRun.current) return;
    hasRun.current = true;

    const delayMs = delay;
    const timeout = setTimeout(() => {
      const start = performance.now();

      const frame = () => {
        const elapsed = performance.now() - start;
        const progress = Math.min(elapsed / DURATION, 1);

        const result = text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            const charThreshold = i / text.length;
            if (progress > charThreshold + 0.35) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("");

        setDisplayed(result);

        if (progress < 1) {
          requestAnimationFrame(frame);
        } else {
          setDisplayed(text);
        }
      };

      requestAnimationFrame(frame);
    }, delayMs);

    return () => clearTimeout(timeout);
  }, [inView, text, delay]);

  return (
    <span ref={ref} className={className} style={style}>
      {displayed}
    </span>
  );
}

/* ─── Data ───────────────────────────────────────────────────── */
const PRINCIPLES = [
  {
    number: "01",
    title: "Data Over Guesswork",
    body: "We start with your actual numbers \u2014 current weekly volume, heart rate zones, race date, injury history and schedule. Not assumptions.",
  },
  {
    number: "02",
    title: "Human Review, Not Just Algorithms",
    body: "Every plan is checked by a coach before it reaches you. Algorithms build the structure. Humans ensure it makes sense for your life.",
  },
  {
    number: "03",
    title: "Built Around Your Life",
    body: "Work, family, travel \u2014 these are inputs, not obstacles. Your plan adapts to your reality, not the other way around.",
  },
];

const BUILD_STEPS = [
  {
    number: "01",
    title: "You complete your intake form",
    body: "8\u201310 minutes covering fitness level, goals, schedule, injury history and race date.",
  },
  {
    number: "02",
    title: "We analyse your data",
    body: "Heart rate zones, weekly volume, thresholds and constraints are mapped together.",
  },
  {
    number: "03",
    title: "A coach reviews every block",
    body: "No plan leaves without a human checking it makes sense for your specific situation.",
  },
  {
    number: "04",
    title: "Your HTML plan is delivered",
    body: "Within 48 hours. Clean, collapsible, readable on any device.",
  },
];

const PLAN_FEATURES = [
  {
    title: "Collapsible Weekly Blocks",
    body: "Expand and collapse each training week. Focus on what\u2019s ahead without being overwhelmed by the full programme.",
  },
  {
    title: "Mobile Friendly",
    body: "Your plan looks great on any device. Check your sessions at the gym, the pool, or on the trail.",
  },
  {
    title: "Easy to Read",
    body: "Clean typography, clear session structure, and logical layout. No deciphering spreadsheet cells.",
  },
];

/* ═══════════════════════════════════════════════════════════════ */
/*  PAGE                                                          */
/* ═══════════════════════════════════════════════════════════════ */
export default function MethodologyPage() {
  return (
    <main style={{ background: BG, color: TEXT }} className="-mt-[72px] relative">

      {/* ─── Grain overlay (full page) ───────────────────── */}
      <div
        className="pointer-events-none fixed inset-0 z-50"
        style={{
          opacity: 0.035,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />

      {/* ───────── SECTION 1 — OPENING ────────────────────── */}
      <section className="min-h-screen flex flex-col justify-center px-8 md:px-24 pt-40 pb-20 relative overflow-hidden">
        {/* Giant outlined background word */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          aria-hidden="true"
        >
          <span
            className="font-headline font-extrabold text-[18vw] leading-none whitespace-nowrap uppercase"
            style={{
              WebkitTextStroke: "1px rgba(245,245,240,0.06)",
              color: "transparent",
            }}
          >
            METHODOLOGY
          </span>
        </div>

        <div className="max-w-4xl relative z-10">
          <motion.span
            className="font-label text-[11px] tracking-[0.35em] uppercase block mb-8"
            style={{ color: ACCENT }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Precision Engineering
          </motion.span>

          <h1 className="font-headline text-[clamp(3rem,9vw,7rem)] font-extrabold leading-[1] tracking-tight mb-10">
            Methodology<span style={{ color: ACCENT }}>.</span>
          </h1>

          <h2 className="font-headline text-2xl md:text-3xl font-bold leading-snug mb-6">
            The thinking behind the{" "}
            <span style={{ color: ACCENT }}>plan</span>.
          </h2>

          <p
            className="font-body text-lg md:text-xl leading-relaxed max-w-2xl"
            style={{ color: DIM }}
          >
            Most training plans are built for an average athlete that doesn&apos;t exist. Yours is built for you.
          </p>
        </div>
      </section>

      <Divider />

      {/* ───────── SECTION 2 — 3 PRINCIPLES ───────────────── */}
      <section className="py-32 md:py-44 px-8 md:px-24">
        <div className="max-w-5xl mx-auto">
          <motion.span
            className="font-label text-[11px] tracking-[0.35em] uppercase block mb-6"
            style={{ color: DIM }}
            {...fadeUp()}
          >
            How We Think
          </motion.span>

          <motion.h2
            className="font-headline text-3xl md:text-4xl font-bold mb-24"
            {...fadeUp(0.05)}
          >
            What we <span style={{ color: ACCENT }}>believe</span>.
          </motion.h2>

          <div className="space-y-28">
            {PRINCIPLES.map((p) => (
              <motion.div
                key={p.number}
                className="relative"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: "easeOut" as const }}
              >
                {/* Large orange background number */}
                <span
                  className="absolute -top-8 -left-2 md:-top-12 md:-left-4 font-headline font-extrabold text-[120px] md:text-[150px] leading-none select-none pointer-events-none"
                  style={{ color: "rgba(184,92,44,0.10)" }}
                  aria-hidden="true"
                >
                  {p.number}
                </span>

                <div className="relative z-10 md:pl-28">
                  <h3 className="font-headline text-2xl md:text-3xl font-bold mb-4">
                    {p.title}
                  </h3>
                  <p
                    className="font-body text-base leading-relaxed max-w-xl"
                    style={{ color: DIM }}
                  >
                    {p.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ───────── SECTION 4 — THE PLAN FORMAT ────────────── */}
      <section className="py-32 md:py-44 px-8 md:px-24">
        <div className="max-w-4xl mx-auto">
          <motion.span
            className="font-label text-[11px] tracking-[0.35em] uppercase block mb-6"
            style={{ color: DIM }}
            {...fadeUp()}
          >
            The Output
          </motion.span>

          <motion.h2
            className="font-headline text-3xl md:text-4xl font-bold mb-6"
            {...fadeUp(0.05)}
          >
            No PDFs. No <span style={{ color: ACCENT }}>spreadsheets</span>.
          </motion.h2>

          <motion.p
            className="font-body text-base leading-relaxed mb-20 max-w-xl"
            style={{ color: DIM }}
            {...fadeUp(0.1)}
          >
            Your plan arrives as a beautifully designed HTML file —
            fully collapsible by week, readable on any device, and built
            to be used, not filed away.
          </motion.p>

          <div className="space-y-8">
            {PLAN_FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="flex gap-8 items-start p-8 rounded-sm"
                style={{
                  background: CARD_BG,
                  border: `1px solid ${CARD_BORDER}`,
                }}
                {...fadeUp(i * 0.12)}
                whileHover={{ y: -4, boxShadow: "0 8px 30px rgba(0,0,0,0.3)" }}
              >
                <span
                  className="font-headline text-3xl font-extrabold shrink-0"
                  style={{ color: "rgba(245,245,240,0.08)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-headline text-lg font-bold mb-2">
                    {feature.title}
                  </h3>
                  <p className="font-body text-sm leading-relaxed" style={{ color: DIM }}>
                    {feature.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ───────── SECTION 5 — CTA ────────────────────────── */}
      <section className="py-32 md:py-44 text-center px-8">
        <motion.h2
          className="font-headline text-4xl md:text-5xl font-bold mb-6"
          {...fadeUp()}
        >
          Ready to build your{" "}
          <span style={{ color: ACCENT }}>plan</span>?
        </motion.h2>
        <motion.p
          className="font-body text-base mb-12 max-w-xl mx-auto"
          style={{ color: DIM }}
          {...fadeUp(0.1)}
        >
          Tell us about yourself. Your plan starts here.
        </motion.p>
        <motion.div {...fadeUp(0.2)}>
          <Link
            href="/assessment"
            className="inline-block font-label text-sm font-bold tracking-widest uppercase px-10 py-4 rounded-sm transition-transform duration-200 hover:scale-[1.02]"
            style={{ background: ACCENT, color: TEXT }}
          >
            Start Your Assessment &rarr;
          </Link>
        </motion.div>
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
  );
}
