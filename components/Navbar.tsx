"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "HOME" },
  { href: "/process", label: "PROCESS" },
  { href: "/methodology", label: "METHODOLOGY" },
  { href: "/pricing", label: "PRICING" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 flex justify-between items-center px-8 py-6 max-w-[1920px] mx-auto transition-all duration-300 ${
        scrolled
          ? "bg-[#0E0E0D]/60 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <Link
        href="/"
        className="font-headline text-xl font-bold tracking-tighter text-on-surface uppercase"
      >
        PLAN METRIC
      </Link>

      <div className="hidden md:flex gap-10">
        {links.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={
                active
                  ? "font-headline tracking-tight text-sm font-bold text-primary border-b border-primary pb-1"
                  : "font-headline tracking-tight text-sm font-medium text-on-surface/70 hover:text-on-surface transition-colors"
              }
            >
              {label}
            </Link>
          );
        })}
      </div>

      <Link
        href="/intake"
        className="bg-primary text-on-primary px-6 py-2 text-xs font-bold tracking-widest rounded-sm hover:opacity-90 active:scale-95 transition-all duration-200 uppercase"
      >
        GET STARTED
      </Link>
    </nav>
  );
}
