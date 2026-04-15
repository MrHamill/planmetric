import Link from "next/link";
import { FadeIn, FadeInHero } from "@/components/FadeIn";
import { ArticleJsonLd } from "@/components/ArticleJsonLd";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What to Eat the Week Before a Triathlon",
  description: "Race week nutrition strategy for triathletes: carb loading protocol, race morning fuelling, on-course nutrition by distance, and hydration targets.",
  openGraph: {
    title: "What to Eat the Week Before a Triathlon",
    description: "Race week nutrition strategy for triathletes: carb loading, race morning fuelling, and on-course nutrition by distance.",
    type: "article",
  },
  alternates: { canonical: "/blog/race-week-nutrition" },
};

const BG = "#0F0F0F";
const TEXT = "#F5F5F0";
const DIM = "rgba(245,245,240,0.45)";
const ACCENT = "#B85C2C";
const CARD_BORDER = "rgba(245,245,240,0.10)";
const RULE = "rgba(245,245,240,0.15)";

const faq = [
  {
    q: "How many carbs should I eat before a triathlon?",
    a: "In the final 48 hours before race day, target 8-10 g of carbohydrate per kilogram of bodyweight per day. For a 70 kg athlete, that is 560-700 g of carbohydrate. Use simple, low-fibre sources like white rice, white pasta, and fruit juice. On race morning, eat 1-2 g/kg bodyweight of carbohydrate 3-4 hours before your start time.",
  },
  {
    q: "How many grams of carbs per hour during a triathlon?",
    a: "It depends on race distance. Sprint distance requires little to no on-course fuelling. Olympic distance needs 30-60 g/hr on the bike. For 70.3, target 60-80 g/hr. For Ironman, aim for 80-90 g/hr. Gut-trained athletes can reach up to 120 g/hr. Always start fuelling within the first 20 minutes of the bike.",
  },
  {
    q: "How much sodium do I need during a long race?",
    a: "Target 300-700 mg of sodium per hour for races and sessions beyond 90 minutes. Average sweat sodium concentration ranges from 500-1,500 mg/L and varies enormously between athletes. Low sodium intake during long races is a leading cause of cramping, nausea and heat illness. Sources include electrolyte tabs, sports drinks and salt capsules.",
  },
  {
    q: "Should I try new nutrition on race day?",
    a: "Never. Every gel, drink and bar should have been tested under training load before race day. A structured gut training protocol over 7+ weeks progressively increases carbohydrate intake from 40 g/hr up to 80-90 g/hr using the specific products you plan to race with. Novel products in a race frequently cause GI distress.",
  },
];

export default function RaceWeekNutritionArticle() {
  return (
    <>
    <ArticleJsonLd title="What to Eat the Week Before a Triathlon" description="Race week nutrition strategy for triathletes: carb loading, race morning fuelling, and on-course nutrition by distance." slug="race-week-nutrition" datePublished="2026-03-25" />
    <FaqJsonLd items={faq} />
    <main style={{ background: BG, color: TEXT }} className="-mt-[72px] relative">
      <div className="pointer-events-none fixed inset-0 z-50" style={{ opacity: 0.035, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundRepeat: "repeat", backgroundSize: "256px 256px" }} />

      <article className="pt-40 pb-32 px-8 md:px-24">
        <div className="max-w-2xl mx-auto">
          <FadeInHero>
            <Link href="/blog" className="font-label text-[10px] tracking-widest uppercase mb-8 inline-block transition-colors hover:text-white" style={{ color: DIM }}>&larr; Back to Journal</Link>
            <div className="flex items-center gap-3 mb-6">
              <span className="font-label text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm" style={{ color: "#f97316", background: "rgba(249,115,22,0.10)" }}>Nutrition</span>
              <span className="font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>5 min read</span>
            </div>
            <h1 className="font-headline text-3xl md:text-5xl font-extrabold leading-tight tracking-tight mb-8">
              What to eat the week before a <span style={{ color: ACCENT }}>triathlon</span>
            </h1>
          </FadeInHero>

          <div className="space-y-8 font-body text-base leading-relaxed" style={{ color: "rgba(245,245,240,0.8)" }}>
            <FadeIn delay={0.1}>
              <p>Race week nutrition is not the time for experimentation. It is the time to execute a strategy you have practised in training. The athletes who get this wrong &mdash; and many do &mdash; spend race day managing GI distress instead of managing pace. Everything you eat in the final seven days should serve one purpose: arrive at the start line with full glycogen stores, a hydrated body, and a gut that has no surprises in store.</p>
            </FadeIn>

            <FadeIn delay={0.12}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Seven days out: steady, familiar, carb-conscious</h2>
              <p>The week before your race is not a carb loading free-for-all. For the first four to five days, eat normally with a slight increase in carbohydrate proportion. Focus on familiar foods. Remove anything high in fibre, spice, or fat that might irritate your gut. Your training volume is tapering, so total calorie intake should drop slightly even as carbohydrate percentage rises.</p>
            </FadeIn>

            <FadeIn delay={0.14}>
              <p>Daily protein stays at 1.6&ndash;2.0 g/kg bodyweight for muscle maintenance and repair. This is particularly important during taper when training stimulus drops but the body is still consolidating adaptations from the build phase.</p>
            </FadeIn>

            <FadeIn delay={0.16}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Two days out: the carbohydrate load begins</h2>
              <p>The final 48 hours before race day is when deliberate carbohydrate loading matters. Target 8&ndash;10 g of carbohydrate per kilogram of bodyweight across the day. For a 70 kg athlete, that is 560&ndash;700 g of carbohydrate &mdash; roughly 2,200&ndash;2,800 calories from carbs alone. This is more than most people expect.</p>
            </FadeIn>

            <FadeIn delay={0.18}>
              <p>Stick to simple, low-fibre carbohydrate sources: white rice, white pasta, white bread, pancakes, fruit juice, sports drink, honey. Reduce vegetables, legumes and whole grains temporarily &mdash; they fill you up before you hit your carbohydrate target and can cause bloating.</p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Race morning: the final fuel</h2>
              <p>Eat 3&ndash;4 hours before your start time. Target 1&ndash;2 g/kg bodyweight of carbohydrate. The meal should be low in fat and low in fibre. Familiar foods only. Toast with honey, a banana, a bowl of white rice with a small amount of protein &mdash; whatever you have tested in training.</p>
              <p className="mt-4">In the final 30&ndash;60 minutes before the swim start, consider 20&ndash;30 g of fast-release carbohydrate &mdash; a gel or half a banana. For sprint-distance races under 90 minutes, skip this. For Olympic distance and beyond, it tops up liver glycogen without risking GI upset.</p>
            </FadeIn>

            <FadeIn delay={0.22}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Race day fuelling by distance</h2>
              <p>Your on-course nutrition strategy should have been rehearsed at least two to three times in long training sessions. Glycogen depletion is extremely difficult to reverse once it begins &mdash; fuel proactively from the first 20 minutes of the bike, not reactively when you feel empty.</p>

              <div className="my-8 rounded-sm overflow-hidden" style={{ border: `1px solid ${CARD_BORDER}` }}>
                <table className="w-full text-sm">
                  <thead><tr style={{ background: "rgba(245,245,240,0.04)" }}>
                    <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Distance</th>
                    <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Carbs/hr</th>
                    <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Notes</th>
                  </tr></thead>
                  <tbody>
                    {[
                      ["Sprint", "0–30 g", "Pre-race carb load more important"],
                      ["Olympic", "30–60 g", "1–2 gels on bike, nothing on run"],
                      ["70.3", "60–80 g", "Fuel bike heavily, 30–60 g/hr on run"],
                      ["Ironman", "80–90 g", "Gut-trained athletes can reach 120 g/hr"],
                    ].map(([dist, carbs, notes], i) => (
                      <tr key={i} style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
                        <td className="p-3 font-medium" style={{ color: TEXT }}>{dist}</td>
                        <td className="p-3" style={{ color: DIM }}>{carbs}</td>
                        <td className="p-3" style={{ color: DIM }}>{notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </FadeIn>

            <FadeIn delay={0.24}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Hydration and sodium: the forgotten variables</h2>
              <p>Fluid targets vary by conditions: 500&ndash;600 mL/hr in cool weather, 750&ndash;1,000 mL/hr in heat. But these are starting points. Your individual sweat rate can be measured with a simple pre-and-post-session weigh-in &mdash; 1 kg lost equals roughly 1 litre of sweat.</p>
              <p className="mt-4">Sodium is critical for sessions and races beyond 90 minutes. Average sweat sodium concentration ranges from 500&ndash;1,500 mg/L, which varies enormously between athletes. Target 300&ndash;700 mg of sodium per hour through electrolyte tabs, sports drink or salt capsules. Low sodium intake during long races is a leading cause of cramping, nausea and heat illness.</p>
            </FadeIn>

            <FadeIn delay={0.26}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Train your gut like you train your legs</h2>
              <p>The gut can absorb approximately 60 g/hr of glucose through one intestinal transporter, and a further 30 g/hr of fructose through a separate one. Products using a 2:1 glucose-to-fructose ratio allow 80&ndash;90 g/hr absorption without GI distress &mdash; but only if you have trained for it.</p>
              <p className="mt-4">A structured gut training protocol over 7+ weeks progressively increases carbohydrate intake from 40 g/hr up to 80&ndash;90 g/hr, using the specific products you plan to race with. Do this on the bike, where most race-day fuelling occurs and where GI issues most commonly arise.</p>
            </FadeIn>

            <FadeIn delay={0.28}>
              <p>The biggest nutrition mistake in endurance racing is not what you eat &mdash; it is eating something for the first time on race day. Every gel, every drink, every bar should have been tested under load before you pin on a race number.</p>
            </FadeIn>

            <FadeIn delay={0.29}>
              <div className="mt-12 pt-8" style={{ borderTop: `1px solid ${RULE}` }}>
                <p className="font-label text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: DIM }}>Keep reading</p>
                <div className="space-y-3">
                  <Link href="/blog/how-to-taper" className="block font-body text-sm transition-colors hover:text-white" style={{ color: ACCENT }}>How to Taper Without Losing Fitness &rarr;</Link>
                  <Link href="/blog/heart-rate-zones" className="block font-body text-sm transition-colors hover:text-white" style={{ color: ACCENT }}>How to Read Your Heart Rate Zones &rarr;</Link>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.3} className="mt-16 pt-12">
              <div style={{ borderTop: `1px solid ${RULE}` }} className="pt-12">
                <p className="font-headline text-xl font-bold mb-4">Ready to train smarter?</p>
                <Link href="/plans" className="inline-block font-label text-sm font-bold tracking-widest uppercase px-10 py-4 rounded-sm transition-transform duration-200 hover:scale-[1.02]" style={{ background: ACCENT, color: TEXT }}>
                  View our plans &rarr;
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </article>

      <footer className="w-full py-10 px-8 md:px-24 flex flex-col md:flex-row justify-between items-center gap-6" style={{ background: BG, borderTop: `1px solid ${CARD_BORDER}` }}>
        <span className="font-label text-[11px] tracking-[0.3em] uppercase font-bold">Plan Metric</span>
        <div className="flex gap-8">
          {[["Terms", "/terms"], ["Privacy", "/privacy"], ["Instagram", "https://www.instagram.com/planmetric"]].map(([label, href]) => (
            <Link key={label} href={href} className="font-label text-[10px] tracking-widest uppercase transition-colors duration-200 hover:text-white" style={{ color: DIM }}>{label}</Link>
          ))}
        </div>
        <span className="font-label text-[10px] tracking-widest uppercase" style={{ color: DIM }}>&copy; 2026 Plan Metric. Precision Endurance.</span>
      </footer>
    </main>
    </>
  );
}
