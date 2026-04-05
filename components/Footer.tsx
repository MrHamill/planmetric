"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  /* Dark-themed pages have their own inline footer */
  const darkPages = ["/", "/process", "/methodology", "/pricing", "/blog", "/plans"];
  if (darkPages.some(p => pathname === p || pathname.startsWith(p + "/"))) return null;

  return (
    <footer className="w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center border-t border-[rgba(245,245,240,0.10)] bg-surface-container-highest">
      <div className="font-headline text-lg font-bold tracking-tighter text-on-surface uppercase mb-6 md:mb-0">
        PLAN METRIC
      </div>

      <div className="flex gap-8 mb-6 md:mb-0">
        {[
          ["ABOUT", "/about"],
          ["PLANS", "/plans"],
          ["TERMS", "/terms"],
          ["PRIVACY", "/privacy"],
          ["INSTAGRAM", "https://www.instagram.com/planmetric"],
        ].map(([label, href]) => (
          <Link
            key={label}
            href={href}
            className="font-label text-[10px] tracking-widest uppercase text-on-surface-variant hover:text-on-surface transition-colors"
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="font-label text-[10px] tracking-widest uppercase text-on-surface-variant">
        &copy; 2026 PLAN METRIC. PRECISION ENDURANCE.
      </div>
    </footer>
  );
}
