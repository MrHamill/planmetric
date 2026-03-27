"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 flex justify-between items-center px-4 sm:px-8 py-4 sm:py-6 max-w-[1920px] mx-auto transition-all duration-300 ${
          scrolled || mobileOpen
            ? "bg-[#1C1614]/95 backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <Link
          href="/"
          className={`font-headline text-xl font-bold tracking-tighter uppercase transition-colors duration-300 ${
            scrolled || mobileOpen ? "text-[#E8DCC8]" : "text-primary"
          }`}
        >
          PLAN METRIC
        </Link>

        {/* Desktop links */}
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

        <div className="flex items-center gap-3">
          <Link
            href="/assessment"
            className="hidden sm:inline-block bg-primary text-on-primary px-4 sm:px-6 py-2 text-xs font-bold tracking-widest rounded-sm hover:bg-primary-dim transition-all duration-200 uppercase whitespace-nowrap"
          >
            GET STARTED
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <span className={`block w-6 h-0.5 transition-all duration-300 ${
              scrolled || mobileOpen ? "bg-[#E8DCC8]" : "bg-on-surface"
            } ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 transition-all duration-300 ${
              scrolled || mobileOpen ? "bg-[#E8DCC8]" : "bg-on-surface"
            } ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 transition-all duration-300 ${
              scrolled || mobileOpen ? "bg-[#E8DCC8]" : "bg-on-surface"
            } ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-[#1C1614]/98 backdrop-blur-lg flex flex-col items-center justify-center gap-8 pt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {links.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`font-headline text-2xl tracking-tight transition-colors ${
                    active
                      ? "text-primary font-bold"
                      : "text-[#E8DCC8]/70 hover:text-[#E8DCC8]"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
            <Link
              href="/assessment"
              onClick={() => setMobileOpen(false)}
              className="mt-4 bg-primary text-on-primary px-8 py-4 text-sm font-bold tracking-widest rounded-sm hover:bg-primary-dim transition-all uppercase"
            >
              GET STARTED
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
