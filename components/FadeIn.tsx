"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export function FadeIn({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: "easeOut" as const, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeInHero({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" as const, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function HoverCard({ children, className, style, tag = "article" }: { children: ReactNode; className?: string; style?: React.CSSProperties; tag?: "article" | "div" }) {
  const Component = tag === "div" ? motion.div : motion.article;
  return (
    <Component
      className={className}
      style={style}
      whileHover={{ y: -6, boxShadow: "0 12px 40px rgba(0,0,0,0.4)", borderColor: "#B85C2C" }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </Component>
  );
}

export function FadeInScale({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" as const, delay }}
    >
      {children}
    </motion.div>
  );
}

export function FadeInSlide({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: "easeOut" as const }}
    >
      {children}
    </motion.div>
  );
}
