"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const BG = "#0F0F0F";
const TEXT = "#F5F5F0";
const DIM = "rgba(245,245,240,0.45)";
const ACCENT = "#B85C2C";
const CARD_BORDER = "rgba(245,245,240,0.10)";

const heroIn = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" as const, delay },
});

const STEPS = [
  {
    num: "01",
    title: "Check your email",
    body: "A confirmation has been sent to your inbox. Check your spam if you don\u2019t see it within 5 minutes.",
  },
  {
    num: "02",
    title: "We build your plan",
    body: "Our team is reviewing your details and building your personalised plan. This takes up to 48 hours.",
  },
  {
    num: "03",
    title: "Your plan arrives",
    body: "Your HTML training plan will be delivered directly to your email \u2014 ready to use immediately.",
  },
];

export default function ThankYouPage() {
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

      <section className="min-h-screen flex flex-col justify-center px-8 md:px-24 pt-40 pb-32 relative overflow-hidden">
        {/* Ghost word */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          aria-hidden="true"
        >
          <span
            className="font-headline font-extrabold text-[16vw] leading-none whitespace-nowrap uppercase"
            style={{ WebkitTextStroke: "1px rgba(245,245,240,0.05)", color: "transparent" }}
          >
            CONFIRMED.
          </span>
        </div>

        <div className="relative z-10 max-w-2xl mx-auto w-full">
          {/* Eyebrow */}
          <motion.span
            className="font-label text-[11px] tracking-[0.35em] uppercase block mb-6"
            style={{ color: ACCENT }}
            {...heroIn(0.1)}
          >
            Order Confirmed
          </motion.span>

          {/* Headline */}
          <motion.h1
            className="font-headline text-[clamp(2.8rem,8vw,5.5rem)] font-extrabold leading-[1.05] tracking-tight mb-4"
            {...heroIn(0.2)}
          >
            You&rsquo;re <span style={{ color: ACCENT }}>in</span>.
          </motion.h1>

          {/* Subline */}
          <motion.p
            className="font-body text-lg md:text-xl leading-relaxed max-w-lg mb-20"
            style={{ color: DIM }}
            {...heroIn(0.35)}
          >
            Your order is confirmed and your plan is being built.
          </motion.p>

          {/* Steps */}
          <div className="space-y-12">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                className="flex gap-8 items-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" as const, delay: 0.5 + i * 0.15 }}
              >
                <span
                  className="font-headline text-4xl font-extrabold shrink-0"
                  style={{ color: "rgba(245,245,240,0.06)" }}
                >
                  {step.num}
                </span>
                <div>
                  <h3 className="font-headline text-lg font-bold mb-2">{step.title}</h3>
                  <p className="font-body text-sm leading-relaxed" style={{ color: DIM }}>{step.body}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact note */}
          <motion.p
            className="font-label text-[10px] tracking-widest uppercase mt-20 mb-10"
            style={{ color: DIM }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          >
            Questions? Email us at{" "}
            <a href="mailto:admin@planmetric.com.au" style={{ color: ACCENT }} className="transition-colors hover:text-white">
              admin@planmetric.com.au
            </a>
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" as const, delay: 1.2 }}
          >
            <Link
              href="/"
              className="inline-block font-label text-sm font-bold tracking-widest uppercase px-10 py-4 rounded-sm transition-transform duration-200 hover:scale-[1.02]"
              style={{ background: ACCENT, color: TEXT }}
            >
              Back to Home &rarr;
            </Link>
          </motion.div>
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
