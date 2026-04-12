"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CARD_BORDER = "rgba(245,245,240,0.10)";
const CARD_BG     = "rgba(245,245,240,0.03)";
const ACCENT      = "#B85C2C";
const TEXT        = "#F5F5F0";
const DIM         = "rgba(245,245,240,0.65)";

interface FaqItem {
  q: string;
  a: string;
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(i: number) {
    setOpenIndex(prev => (prev === i ? null : i));
  }

  return (
    <div className="space-y-3 my-6">
      {items.map(({ q, a }, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className="rounded-sm overflow-hidden"
            style={{ border: `1px solid ${isOpen ? ACCENT : CARD_BORDER}`, transition: "border-color 0.2s ease" }}
          >
            {/* Question row — button for accessibility */}
            <button
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
              style={{ background: isOpen ? "rgba(184,92,44,0.08)" : CARD_BG, cursor: "pointer" }}
            >
              <span
                className="font-headline font-bold text-sm leading-snug"
                style={{ color: TEXT }}
              >
                {q}
              </span>

              {/* Animated +/× indicator */}
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{
                  color: ACCENT,
                  fontSize: "1.25rem",
                  lineHeight: 1,
                  flexShrink: 0,
                  display: "inline-block",
                  fontWeight: 300,
                }}
                aria-hidden="true"
              >
                +
              </motion.span>
            </button>

            {/* Answer — animated reveal */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="answer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                  style={{ overflow: "hidden" }}
                >
                  <div
                    className="px-5 py-4"
                    style={{ borderTop: `1px solid ${CARD_BORDER}` }}
                  >
                    <p className="font-body text-sm leading-relaxed" style={{ color: DIM }}>
                      {a}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
