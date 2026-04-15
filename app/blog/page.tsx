import Link from "next/link";
import { FadeIn, FadeInHero } from "@/components/FadeIn";
import { ArticleGrid } from "@/components/ArticleGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Journal",
  description: "Evidence-based articles on endurance training, nutrition, and race preparation. Written by coaches, backed by science.",
  openGraph: {
    title: "The Journal — Plan Metric",
    description: "Evidence-based articles on endurance training, nutrition, and race preparation.",
  },
  alternates: { canonical: "/blog" },
};

const BG = "#0F0F0F";
const TEXT = "#F5F5F0";
const DIM = "rgba(245,245,240,0.45)";
const ACCENT = "#B85C2C";
const CARD_BG = "rgba(245,245,240,0.03)";
const CARD_BORDER = "rgba(245,245,240,0.10)";
const RULE = "rgba(245,245,240,0.15)";


const ALL_ARTICLES = [
  { title: "How do I start running as a beginner?", category: "Run", readTime: "9 min read", excerpt: "A complete guide to your first weeks of running — the Couch to 5K program, essential gear, conversational pace, common mistakes, and how to build a running habit that sticks.", href: "/blog/start-running-beginner", publishDate: "2026-04-18" },
  { title: "How often should I run per week?", category: "Run", readTime: "8 min read", excerpt: "A research-backed guide to weekly running frequency — how many days to run at each level, the 80/20 intensity rule, sample weekly schedules, and the recovery principles that keep you injury-free.", href: "/blog/how-often-run-per-week", publishDate: "2026-04-21" },
  { title: "How long does it take to run a 5K?", category: "Run", readTime: "9 min read", excerpt: "Average 5K finish times by age and gender, how long to train for your first 5K, walk/run strategies, parkrun data, and how quickly beginners improve.", href: "/blog/how-long-to-run-5k", publishDate: "2026-04-24" },
  { title: "What is a good 5K time for a beginner?", category: "Run", readTime: "9 min read", excerpt: "5K benchmark times by age group and gender, parkrun percentile data, realistic targets after 8 weeks of training, and how to use age grading to compare your performance.", href: "/blog/good-5k-time-beginner", publishDate: "2026-04-27" },
  { title: "How do I improve my running pace?", category: "Run", readTime: "9 min read", excerpt: "A complete guide to improving your running pace through interval training, tempo runs, hill repeats, cadence work, and strength training. Evidence-based methods for intermediate runners.", href: "/blog/improve-running-pace", publishDate: "2026-04-30" },
  { title: "How do I breathe properly when running?", category: "Run", readTime: "9 min read", excerpt: "Nose vs mouth breathing, rhythmic breathing patterns by intensity, diaphragmatic breathing training, side stitch prevention, and cold weather breathing techniques.", href: "/blog/breathing-while-running", publishDate: "2026-05-03" },
  { title: "What should I eat before a run?", category: "Nutrition", readTime: "8 min read", excerpt: "Pre-run meal timing, best foods by run type, fasted running guidelines, foods to avoid, hydration protocol, and specific advice for morning runners.", href: "/blog/what-to-eat-before-running", publishDate: "2026-05-06" },
  { title: "How do I avoid injury when running?", category: "Run", readTime: "9 min read", excerpt: "Evidence-based strategies to prevent running injuries: load management, strength training, footwear rotation, recovery priorities, and when to push through pain safely.", href: "/blog/avoid-running-injury", publishDate: "2026-05-09" },
  { title: "How do I train for a half marathon from scratch?", category: "Run", readTime: "10 min read", excerpt: "A complete 12-week half marathon training plan for beginners — weekly schedules, pacing strategy, key sessions, strength work, and the taper.", href: "/blog/half-marathon-training-plan", publishDate: "2026-05-12" },
  { title: "How many weeks does it take to train for a marathon?", category: "Run", readTime: "10 min read", excerpt: "A research-backed guide to marathon training timelines — periodisation phases, weekly volume by goal time, key sessions, pacing strategy, and how to structure your build from base to race day.", href: "/blog/marathon-training-weeks", publishDate: "2026-05-15" },
  { title: "Heart rate zone training: the complete guide for endurance athletes", category: "Training", readTime: "12 min read", excerpt: "Everything you need to know about zone training — the five-zone system, the 80/20 rule, how to calibrate zones per discipline, and how to structure your week around intensity.", href: "/blog/zone-training-complete-guide", publishDate: "2025-03-25" },
  { title: "Gold Coast Marathon 2026: the complete training and pacing guide", category: "Run", readTime: "10 min read", excerpt: "How to train for the Gold Coast Marathon — pacing strategy by goal time, 16-week training structure, fuelling plan, and race day checklist for the July 5 race.", href: "/blog/gold-coast-marathon-2026-guide", publishDate: "2025-03-25" },
  { title: "Triathlon training for beginners: where to start", category: "Triathlon", readTime: "10 min read", excerpt: "Everything a first-time triathlete needs to know — how much training is enough, which discipline to prioritise, how to structure your week, and the gear that actually matters.", href: "/blog/triathlon-training-beginners", publishDate: "2025-03-25" },
  { title: "City2Surf 2026: the complete pacing and training guide", category: "Run", readTime: "8 min read", excerpt: "How to pace City2Surf, survive Heartbreak Hill, and build a 17-week training plan for the August 9 race. Pacing tables, course breakdown, and race day checklist.", href: "/blog/city2surf-2026-guide", publishDate: "2025-03-25" },
  { title: "How to read your heart rate zones \u2014 and why most athletes ignore them", category: "Training", readTime: "6 min read", excerpt: "The five-zone system explained, why Zone 2 is chronically underused, and how to calibrate zones properly across swim, bike and run.", href: "/blog/heart-rate-zones", publishDate: "2025-03-25" },
  { title: "What to eat the week before a triathlon", category: "Nutrition", readTime: "5 min read", excerpt: "From carbohydrate loading to race-morning fuelling. A day-by-day breakdown of what to eat and what to avoid.", href: "/blog/race-week-nutrition", publishDate: "2025-03-25" },
  { title: "Why most training plans fail \u2014 and what to do instead", category: "Methodology", readTime: "7 min read", excerpt: "Standardised plans underperform individualised ones by half. The research behind adaptive training and the 10% rule.", href: "/blog/why-training-plans-fail", publishDate: "2025-03-25" },
  { title: "Brick sessions explained \u2014 how to train your legs for the run off the bike", category: "Triathlon", readTime: "6 min read", excerpt: "What brick legs are, how many bricks you need before race day, and why your cycling cadence determines your run.", href: "/blog/brick-sessions-explained", publishDate: "2025-03-25" },
  { title: "How to taper before race day without losing fitness", category: "Racing", readTime: "5 min read", excerpt: "Reduce volume, maintain intensity, and arrive at the start line sharp. The science of the pre-race taper.", href: "/blog/how-to-taper", publishDate: "2025-03-25" },
];

export default function BlogPage() {
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

      {/* Hero */}
      <section className="min-h-[55vh] flex flex-col justify-end px-8 md:px-24 pt-40 pb-24 relative overflow-hidden">
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          aria-hidden="true"
        >
          <span
            className="font-headline font-extrabold text-[22vw] leading-none whitespace-nowrap uppercase"
            style={{ WebkitTextStroke: "1px rgba(245,245,240,0.05)", color: "transparent" }}
          >
            JOURNAL
          </span>
        </div>

        <div className="relative z-10 max-w-3xl">
          <FadeInHero delay={0.1}>
            <span
              className="font-label text-[11px] tracking-[0.35em] uppercase block mb-6"
              style={{ color: ACCENT }}
            >
              The Journal
            </span>
          </FadeInHero>

          <FadeInHero delay={0.2}>
            <h1 className="font-headline text-[clamp(2.5rem,7vw,5rem)] font-extrabold leading-[1.05] tracking-tight mb-6">
              Insights &amp;{" "}
              <span style={{ color: ACCENT }}>methodology</span>.
            </h1>
          </FadeInHero>

          <FadeInHero delay={0.35}>
            <p
              className="font-body text-lg md:text-xl leading-relaxed max-w-xl"
              style={{ color: DIM }}
            >
              Evidence-based articles on endurance training, nutrition, and
              race preparation. Written by coaches, backed by science.
            </p>
          </FadeInHero>
        </div>
      </section>

      {/* Divider */}
      <div className="px-8 md:px-24"><div className="max-w-6xl mx-auto" style={{ height: 1, background: RULE }} /></div>

      {/* Articles */}
      <section className="py-24 md:py-32 px-8 md:px-24">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <span
              className="font-label text-[11px] tracking-[0.35em] uppercase block mb-16"
              style={{ color: DIM }}
            >
              Articles
            </span>
          </FadeIn>

          <ArticleGrid articles={ALL_ARTICLES} />
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
            <a key={label} href={href} className="font-label text-[10px] tracking-widest uppercase transition-colors duration-200 hover:text-white" style={{ color: DIM }}>
              {label}
            </a>
          ))}
        </div>
        <span className="font-label text-[10px] tracking-widest uppercase" style={{ color: DIM }}>&copy; 2026 Plan Metric. Precision Endurance.</span>
      </footer>
    </main>
  );
}
