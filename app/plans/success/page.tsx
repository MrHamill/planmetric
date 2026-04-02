"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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

function SuccessContent() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [email, setEmail] = useState("");
  const [planUrl, setPlanUrl] = useState("");

  useEffect(() => {
    if (!sessionId) { setStatus("error"); return; }

    fetch(`/api/checkout/starter/verify?session_id=${sessionId}`)
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          setEmail(data.email || "");
          setPlanUrl(data.planUrl || "");
          setStatus("success");
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [sessionId]);

  if (status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center px-8" style={{ background: BG, color: TEXT }}>
        <div className="text-center">
          <div
            className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-6"
            style={{ borderColor: ACCENT, borderTopColor: "transparent" }}
          />
          <p className="font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>
            Confirming payment...
          </p>
        </div>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="min-h-screen flex items-center justify-center px-8" style={{ background: BG, color: TEXT }}>
        <div className="max-w-lg text-center">
          <span className="mb-8 block text-red-400" style={{ fontSize: "48px" }}>&#10007;</span>
          <h1 className="font-headline text-3xl font-bold tracking-tight mb-4">
            Something went wrong
          </h1>
          <p className="font-body mb-8" style={{ color: DIM }}>
            We could not confirm your payment. If you were charged, please email us and we will sort it out immediately.
          </p>
          <a
            href="mailto:admin@planmetric.com.au"
            className="px-8 py-4 font-label text-xs uppercase tracking-widest hover:opacity-90 transition-all rounded-sm inline-block"
            style={{ background: ACCENT, color: TEXT }}
          >
            Email admin@planmetric.com.au
          </a>
        </div>
      </main>
    );
  }

  return (
    <main style={{ background: BG, color: TEXT }} className="-mt-[72px] relative">
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
          <motion.span
            className="font-label text-[11px] tracking-[0.35em] uppercase block mb-6"
            style={{ color: ACCENT }}
            {...heroIn(0.1)}
          >
            Payment Confirmed
          </motion.span>

          <motion.h1
            className="font-headline text-[clamp(2.8rem,8vw,5.5rem)] font-extrabold leading-[1.05] tracking-tight mb-4"
            {...heroIn(0.2)}
          >
            You&rsquo;re <span style={{ color: ACCENT }}>in</span>.
          </motion.h1>

          <motion.p
            className="font-body text-lg md:text-xl leading-relaxed max-w-lg mb-12"
            style={{ color: DIM }}
            {...heroIn(0.35)}
          >
            Your plan is on its way to{" "}
            {email ? <span style={{ color: ACCENT }}>{email}</span> : "your inbox"}.
            Check your spam folder if you don&rsquo;t see it within a few minutes.
          </motion.p>

          <motion.div
            className="space-y-8 mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" as const, delay: 0.5 }}
          >
            {[
              { num: "01", title: "Check your email", body: "Your plan link has been sent to your inbox. Check spam if you don\u2019t see it within 5 minutes." },
              { num: "02", title: "Open your plan", body: "Click the link in the email to view your full interactive training plan in your browser." },
              { num: "03", title: "Start training", body: "Follow your week-by-week schedule. Your plan is yours forever \u2014 bookmark it for easy access." },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                className="flex gap-8 items-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" as const, delay: 0.6 + i * 0.15 }}
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
          </motion.div>

          {planUrl && (
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" as const, delay: 1.0 }}
            >
              <a
                href={planUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-label text-sm font-bold tracking-widest uppercase px-10 py-4 rounded-sm transition-transform duration-200 hover:scale-[1.02]"
                style={{ border: `1px solid ${ACCENT}`, color: ACCENT }}
              >
                View Your Plan Now &rarr;
              </a>
            </motion.div>
          )}

          <motion.p
            className="font-label text-[10px] tracking-widest uppercase mb-10"
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

export default function PlansSuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center" style={{ background: BG }}>
        <div
          className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: ACCENT, borderTopColor: "transparent" }}
        />
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}
