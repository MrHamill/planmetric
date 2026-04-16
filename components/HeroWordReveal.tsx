"use client";

import { motion } from "framer-motion";

const ACCENT = "#B85C2C";

export function HeroWordReveal() {
  return (
    <span style={{ display: "block", whiteSpace: "nowrap" }}>
      <motion.span
        style={{
          display: "inline-block",
          marginRight: "0.25em",
          color: "rgba(245,245,240,0.85)",
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 0.85, y: 0 }}
        transition={{
          duration: 0.6,
          ease: "easeOut" as const,
          delay: 0.25,
        }}
      >
        Plan
      </motion.span>
      <motion.span
        style={{
          display: "inline-block",
          color: ACCENT,
          opacity: 0.9,
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 0.9, y: 0 }}
        transition={{
          duration: 0.6,
          ease: "easeOut" as const,
          delay: 0.4,
        }}
      >
        Metric.
      </motion.span>
    </span>
  );
}
