"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "HOME" },
  { href: "/process", label: "PROCESS" },
  { href: "/methodology", label: "METHODOLOGY" },
  { href: "/pricing", label: "PRICING" },
  { href: "/blog", label: "BLOG" },
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
          ? "bg-[#1C1614]/95 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <Link
        href="/"
        className={`font-headline text-xl font-bold tracking-tighter uppercase transition-colors duration-300 ${
          scrolled ? "text-[#E8DCC8]" : "text-primary"
        }`}
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
              className={`font-headline tracking-tight text-sm transition-colors duration-300 ${
                active
                  ? scrolled
                    ? "font-bold text-[#E8DCC8] border-b border-[#E8DCC8] pb-1"
                    : "font-bold text-primary border-b border-primary pb-1"
                  : scrolled
                    ? "font-medium text-[#E8DCC8]/70 hover:text-[#E8DCC8]"
                    : "font-medium text-on-surface hover:text-primary"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      <Link
        href="/assessment"
        className="bg-primary text-on-primary px-6 py-2 text-xs font-bold tracking-widest rounded-sm hover:bg-primary-dim transition-all duration-200 uppercase"
      >
        GET STARTED
      </Link>
    </nav>
  );
}
