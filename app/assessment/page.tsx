"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import IntakePage from "@/app/intake/page";

const BG = "#0F0F0F";
const TEXT = "#F5F5F0";
const DIM = "rgba(245,245,240,0.45)";
const ACCENT = "#B85C2C";

function AssessmentContent() {
  const searchParams = useSearchParams();
  const planFromUrl = searchParams.get("plan") as "premium" | "elite" | null;

  return (
    <div style={{ background: BG, color: TEXT }}>
      {/* Header */}
      <div className="pt-36 pb-16 px-8 md:px-24 max-w-2xl mx-auto">
        <motion.span
          className="font-label text-[11px] tracking-[0.35em] uppercase block mb-6"
          style={{ color: ACCENT }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" as const, delay: 0.1 }}
        >
          Assessment
        </motion.span>

        <motion.h1
          className="font-headline text-[clamp(2.2rem,6vw,4rem)] font-extrabold leading-[1.05] tracking-tight mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" as const, delay: 0.2 }}
        >
          Let&rsquo;s build your <span style={{ color: ACCENT }}>plan</span>.
        </motion.h1>

        <motion.p
          className="font-body text-lg leading-relaxed max-w-xl"
          style={{ color: DIM }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" as const, delay: 0.35 }}
        >
          Tell us about your training, your goals, and your life. We use every detail to build a plan that fits &mdash; not the other way around.
        </motion.p>
      </div>

      {/* Intake Form — pass pre-selected plan to skip plan selection */}
      <IntakePage preSelectedPlan={planFromUrl || undefined} />
    </div>
  );
}

export default function AssessmentPage() {
  return (
    <Suspense>
      <AssessmentContent />
    </Suspense>
  );
}
