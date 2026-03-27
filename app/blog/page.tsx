"use client";

import { motion } from "framer-motion";

/* ─── Article data ───────────────────────────────────────── */
const FEATURED = [
  {
    title: "How to structure a triathlon training plan",
    excerpt: "Breaking down the swim-bike-run balance across a 16-week block. Periodisation, brick sessions, and taper strategy explained.",
    readTime: "8 min read",
    category: "Training",
    categoryColor: "text-primary",
    image: "/images/transition-overhead.png",
  },
  {
    title: "The science of polarised training",
    excerpt: "Why 80/20 intensity distribution produces faster endurance athletes. The research behind spending more time going slow.",
    readTime: "6 min read",
    category: "Training",
    categoryColor: "text-primary",
    image: "/images/blog-intervals.png",
  },
  {
    title: "Race day nutrition: a complete guide",
    excerpt: "From carb loading to on-course fuelling. How to dial in your nutrition strategy for distances from 10K to Ironman.",
    readTime: "10 min read",
    category: "Nutrition",
    categoryColor: "text-run",
    image: "/images/blog-nutrition.png",
  },
];

const TOPICS = [
  { title: "Zone 2 training: the foundation of endurance", category: "Training", readTime: "5 min" },
  { title: "Swim technique drills for triathletes", category: "Swim", readTime: "7 min" },
  { title: "Power meter basics for cyclists", category: "Bike", readTime: "6 min" },
  { title: "Running economy: what it is and how to improve it", category: "Run", readTime: "8 min" },
  { title: "Recovery protocols that actually work", category: "Training", readTime: "5 min" },
  { title: "Strength training for endurance athletes", category: "Training", readTime: "7 min" },
];

const categoryColorMap: Record<string, string> = {
  Training: "text-primary bg-primary/10",
  Swim: "text-swim bg-swim/10",
  Bike: "text-bike bg-bike/10",
  Run: "text-run bg-run/10",
  Nutrition: "text-run bg-run/10",
};

/* ─── Variants ───────────────────────────────────────────── */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

/* ─── Page ────────────────────────────────────────────────── */
export default function BlogPage() {
  return (
    <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">

      {/* ── Hero ──────────────────────────────────────────── */}
      <motion.header
        className="mb-16 max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <span className="font-label text-secondary tracking-[0.3em] text-[10px] uppercase mb-4 block">
          The Journal
        </span>
        <h1 className="font-serif text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-none text-on-surface">
          Insights &amp;<br />
          <span className="text-primary">Methodology.</span>
        </h1>
        <p className="font-body text-lg text-on-surface-variant max-w-2xl leading-relaxed">
          Evidence-based articles on endurance training, nutrition, and
          race preparation. Written by coaches, backed by science.
        </p>
      </motion.header>

      {/* ── Featured articles ─────────────────────────────── */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {FEATURED.map((article) => (
          <motion.article
            key={article.title}
            variants={item}
            className="bg-surface-container rounded-sm border border-outline/18 overflow-hidden group hover:border-primary/40 transition-colors"
          >
            {/* Featured image */}
            <div className="h-[200px] bg-surface-container-high relative overflow-hidden rounded-t-sm">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
              />
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className={`font-label text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm ${categoryColorMap[article.category] || "text-primary bg-primary/10"}`}>
                  {article.category}
                </span>
                <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest">
                  {article.readTime}
                </span>
              </div>
              <h2 className="font-serif text-xl font-bold mb-3 text-on-surface leading-snug">
                {article.title}
              </h2>
              <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                {article.excerpt}
              </p>
            </div>
          </motion.article>
        ))}
      </motion.div>

      {/* ── More articles list ────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h3 className="font-headline text-xl font-bold mb-8 text-on-surface">
          More Articles
        </h3>
        <div className="space-y-4 mb-12">
          {TOPICS.map((topic) => (
            <div
              key={topic.title}
              className="bg-surface-container p-6 rounded-sm border border-outline/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className={`font-label text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm whitespace-nowrap ${categoryColorMap[topic.category] || "text-primary bg-primary/10"}`}>
                  {topic.category}
                </span>
                <span className="font-body text-sm text-on-surface font-medium">
                  {topic.title}
                </span>
              </div>
              <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest whitespace-nowrap">
                {topic.readTime}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="bg-surface-container-high text-on-surface px-8 py-4 text-sm font-bold tracking-widest rounded-sm hover:bg-primary hover:text-on-primary transition-all uppercase">
            Find More Articles
          </button>
        </div>
      </motion.section>

    </main>
  );
}
