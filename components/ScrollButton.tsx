"use client";

import { motion } from "framer-motion";

const DIM = "rgba(245,245,240,0.45)";

export function ScrollButton({ targetId }: { targetId: string }) {
  return (
    <motion.button
      onClick={() => document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" })}
      aria-label="Scroll to next section"
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 cursor-pointer"
      style={{ color: DIM }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, y: [0, 8, 0] }}
      transition={{
        opacity: { duration: 0.5, delay: 1.8 },
        y: { duration: 2, repeat: Infinity, ease: "easeInOut" as const },
      }}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </motion.button>
  );
}
