"use client";

import { motion } from "framer-motion";

const ACCENT = "#B85C2C";

const HERO_LINES: { word: string; accent?: boolean }[][] = [
  [{ word: "Train" }, { word: "with" }],
  [{ word: "data.", accent: true }, { word: "Race" }, { word: "with" }],
  [{ word: "confidence." }],
];

export function HeroWordReveal() {
  let wordIdx = 0;

  return (
    <>
      {HERO_LINES.map((line, li) => (
        <span key={li} style={{ display: "block" }}>
          {line.map(({ word, accent }) => {
            const i = wordIdx++;
            return (
              <motion.span
                key={i}
                style={{
                  display: "inline-block",
                  marginRight: "0.25em",
                  ...(accent ? { color: ACCENT } : {}),
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut" as const,
                  delay: 0.25 + i * 0.08,
                }}
              >
                {word}
              </motion.span>
            );
          })}
        </span>
      ))}
    </>
  );
}
