import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center border-t border-on-surface/5 bg-background">
      <div className="font-headline text-lg font-bold tracking-tighter text-on-surface uppercase mb-6 md:mb-0">
        PLAN METRIC
      </div>

      <div className="flex gap-8 mb-6 md:mb-0">
        {[
          ["TERMS", "/terms"],
          ["PRIVACY", "/privacy"],
          ["INSTAGRAM", "https://www.instagram.com/planmetric"],
        ].map(([label, href]) => (
          <Link
            key={label}
            href={href}
            className="font-label text-[10px] tracking-widest uppercase text-on-surface/40 hover:text-on-surface transition-colors"
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="font-label text-[10px] tracking-widest uppercase text-primary">
        © 2026 PLAN METRIC. PRECISION ENDURANCE.
      </div>
    </footer>
  );
}
