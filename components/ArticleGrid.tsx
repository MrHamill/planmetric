"use client";

import Link from "next/link";
import { FadeIn, HoverCard } from "@/components/FadeIn";
import { useMemo } from "react";

const ACCENT = "#B85C2C";
const DIM = "rgba(245,245,240,0.45)";
const CARD_BG = "rgba(245,245,240,0.03)";
const CARD_BORDER = "rgba(245,245,240,0.10)";

const catColor: Record<string, { text: string; bg: string }> = {
  Training:    { text: ACCENT, bg: "rgba(184,92,44,0.10)" },
  Swim:        { text: "#0ea5e9", bg: "rgba(14,165,233,0.10)" },
  Bike:        { text: "#22c55e", bg: "rgba(34,197,94,0.10)" },
  Run:         { text: "#f97316", bg: "rgba(249,115,22,0.10)" },
  Nutrition:   { text: "#f97316", bg: "rgba(249,115,22,0.10)" },
  Methodology: { text: "#8b5cf6", bg: "rgba(139,92,246,0.10)" },
  Triathlon:   { text: "#a855f7", bg: "rgba(168,85,247,0.10)" },
  Racing:      { text: "#ef4444", bg: "rgba(239,68,68,0.10)" },
};

export type Article = {
  title: string;
  category: string;
  readTime: string;
  excerpt: string;
  href: string;
  publishDate: string;
};

export function ArticleGrid({ articles }: { articles: Article[] }) {
  const published = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return articles.filter((a) => a.publishDate <= today);
  }, [articles]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {published.map((article, i) => {
        const cat = catColor[article.category] || catColor.Training;
        return (
          <FadeIn key={article.title} delay={i * 0.1}>
            <HoverCard
              className="rounded-sm overflow-hidden group cursor-pointer flex flex-col h-full"
              style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
            >
              <Link href={article.href} className="p-8 flex-1 flex flex-col" style={{ color: "inherit", textDecoration: "none" }}>
                <div className="flex items-center gap-3 mb-6">
                  <span
                    className="font-label text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm"
                    style={{ color: cat.text, background: cat.bg }}
                  >
                    {article.category}
                  </span>
                  <span className="font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>
                    {article.readTime}
                  </span>
                </div>
                <h2 className="font-headline text-xl font-bold mb-4 leading-snug">
                  {article.title}
                </h2>
                <p className="font-body text-sm leading-relaxed flex-1" style={{ color: DIM }}>
                  {article.excerpt}
                </p>
                <span
                  className="font-label text-xs tracking-wider mt-6 inline-block"
                  style={{ color: ACCENT }}
                >
                  Read article &rarr;
                </span>
              </Link>
            </HoverCard>
          </FadeIn>
        );
      })}
    </div>
  );
}
