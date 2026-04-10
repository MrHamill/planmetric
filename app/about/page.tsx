"use client";

import Link from "next/link";
import { motion } from "framer-motion";

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

const heroIn = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" as const, delay },
});

/* ═══════════════════════════════════════════════════════════════ */
export default function AboutPage() {
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

      {/* ═══════════════ HERO ═══════════════════════════════ */}
      <section className="min-h-[55vh] flex flex-col justify-end px-8 md:px-24 pt-40 pb-24 relative overflow-hidden">
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          aria-hidden="true"
        >
          <span
            className="font-headline font-extrabold text-[22vw] leading-none whitespace-nowrap uppercase"
            style={{ WebkitTextStroke: "1px rgba(245,245,240,0.05)", color: "transparent" }}
          >
            ABOUT
          </span>
        </div>

        <div className="relative z-10 max-w-3xl">
          <motion.span
            className="font-label text-[11px] tracking-[0.35em] uppercase block mb-6"
            style={{ color: ACCENT }}
            {...heroIn(0.1)}
          >
            About
          </motion.span>

          <motion.h1
            className="font-headline text-[clamp(2.5rem,7vw,5rem)] font-extrabold leading-[1.05] tracking-tight mb-6"
            {...heroIn(0.2)}
          >
            The person behind the{" "}
            <span style={{ color: ACCENT }}>plan</span>.
          </motion.h1>

          <motion.p
            className="font-body text-lg md:text-xl leading-relaxed max-w-xl"
            style={{ color: DIM }}
            {...heroIn(0.35)}
          >
            Built by an athlete, for athletes.
          </motion.p>
        </div>
      </section>

      {/* Divider */}
      <div className="px-8 md:px-24"><div className="max-w-6xl mx-auto" style={{ height: 1, background: RULE }} /></div>

      {/* ═══════════════ FOUNDER STORY ══════════════════════ */}
      <section className="py-24 md:py-32 px-8 md:px-24">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 md:gap-20 items-start">

          {/* Image — left */}
          <motion.div
            className="w-full md:w-[40%] flex-shrink-0"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, ease: "easeOut" as const }}
          >
            <img
              src="/images/pete-mooloolaba.jpg"
              alt="Pete Hamill crossing the finish line at Mooloolaba Triathlon"
              className="w-full rounded-sm"
              style={{ filter: "grayscale(100%)" }}
            />
            <p
              className="font-label text-[10px] tracking-widest uppercase mt-4"
              style={{ color: DIM }}
            >
              Mooloolaba Triathlon &middot; 2:35:34
            </p>
          </motion.div>

          {/* Text — right */}
          <div className="flex-1">
            <motion.span
              className="font-label text-[11px] tracking-[0.35em] uppercase block mb-6"
              style={{ color: DIM }}
              {...fadeUp()}
            >
              The Founder
            </motion.span>

            <motion.h2
              className="font-headline text-3xl md:text-4xl font-bold mb-4"
              {...fadeUp(0.05)}
            >
              Pete <span style={{ color: ACCENT }}>Hamill</span>
            </motion.h2>

            <motion.p
              className="font-label text-xs tracking-widest uppercase mb-12"
              style={{ color: DIM }}
              {...fadeUp(0.1)}
            >
              Endurance Athlete &middot; Brisbane, Australia
            </motion.p>

            <motion.div
              className="space-y-6 font-body text-base md:text-lg leading-relaxed"
              style={{ color: "rgba(245,245,240,0.75)" }}
              {...fadeUp(0.15)}
            >
              <p>
                I built Plan Metric because I couldn&rsquo;t find a training plan that fit my
                actual life. Everything was either a rigid template that ignored my schedule, or
                a $300/month coach I didn&rsquo;t need.
              </p>
              <p>
                So I started digging &mdash; into periodisation science, heart rate zone
                methodology, polarised training models, and race-specific programming &mdash;
                and I built something better.
              </p>
              <p>
                Plan Metric is what came out of that obsession. Every plan is built on
                peer-reviewed training science and structured around your real data &mdash; your
                fitness, your schedule, your race, your body. Not a template. Not an algorithm.
                A plan built by someone who actually does this sport and understands what it
                takes to show up on race day prepared.
              </p>
              <p>
                That photo is from my first Olympic distance triathlon. Next goal: the 70.3.
                Let&rsquo;s see if Plan Metric can get me to go sub&#8209;5.
              </p>
              <p style={{ color: TEXT }}>
                I don&rsquo;t have letters after my name. What I have is an
                obsession with the science behind performance and the
                conviction that athletes deserve better than a generic plan.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="px-8 md:px-24"><div className="max-w-6xl mx-auto" style={{ height: 1, background: RULE }} /></div>

      {/* ═══════════════ WHAT DRIVES US ═════════════════════ */}
      <section className="py-24 md:py-32 px-8 md:px-24">
        <div className="max-w-6xl mx-auto">
          <motion.span
            className="font-label text-[11px] tracking-[0.35em] uppercase block mb-6"
            style={{ color: DIM }}
            {...fadeUp()}
          >
            The Mission
          </motion.span>

          <motion.h2
            className="font-headline text-3xl md:text-4xl font-bold mb-16"
            {...fadeUp(0.05)}
          >
            Make expert-level training{" "}
            <span style={{ color: ACCENT }}>accessible</span>.
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Science First",
                body: "Every plan is grounded in peer-reviewed research — periodisation, zone methodology, and race-specific programming. No guesswork.",
              },
              {
                title: "Built for Real Life",
                body: "Your plan fits around your job, your family, and your available hours. Not the other way around.",
              },
              {
                title: "No Gatekeeping",
                body: "You shouldn't need a $300/month coach to get a quality training plan. We made the science affordable.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                className="p-10 rounded-sm"
                style={{
                  background: CARD_BG,
                  border: `1px solid ${CARD_BORDER}`,
                }}
                {...fadeUp(i * 0.15)}
                whileHover={{
                  y: -6,
                  boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
                }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="font-headline text-lg font-bold tracking-wide mb-4">
                  {item.title}
                </h3>
                <p className="font-body text-sm leading-relaxed" style={{ color: DIM }}>
                  {item.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="px-8 md:px-24"><div className="max-w-6xl mx-auto" style={{ height: 1, background: RULE }} /></div>

      {/* ═══════════════ CTA ════════════════════════════════ */}
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

      {/* ═══════════════ FOOTER ═════════════════════════════ */}
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
