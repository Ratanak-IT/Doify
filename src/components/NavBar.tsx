"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us",   href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

// Sun icon (light mode / always shown as toggle icon)
const SunIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

// Moon icon (dark mode)
const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
  </svg>
);

export default function NavBar() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.replace("/#", "/"));

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-slate-900",
        scrolled || menuOpen
          ? "border-b border-white/5 shadow-lg backdrop-blur-xl bg-slate-900/95"
          : "",
      ].join(" ")}
    >
      {/* ── Top bar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/40 group-hover:shadow-violet-500/60 transition-shadow">
            <img src="/logo-doify.png" alt="Doify Logo" className="h-6 w-6 object-contain" />
          </div>
          <span className="text-[17px] font-bold tracking-tight text-white">Doify</span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={[
                "relative px-3.5 py-2 text-sm font-medium rounded-lg transition-colors duration-150",
                isActive(link.href)
                  ? "text-white bg-white/10"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.07]",
              ].join(" ")}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-violet-500" />
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-1.5 shrink-0">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            aria-label="Language"
            className="flex items-center gap-1.5 px-3 py-2 h-10 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
            </svg>
            EN
          </button>
          <Link href="/login" className="px-4 py-2.5 text-sm font-semibold text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/10">
            Log in
          </Link>
          <Link href="/register" className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold rounded-lg transition-all hover:-translate-y-px shadow-md shadow-violet-500/30 hover:shadow-violet-500/50">
            Get started free
          </Link>
        </div>

        {/* Mobile right: theme toggle + hamburger */}
        <div className="md:hidden flex items-center gap-1">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-11 h-11 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            className="w-11 h-11 flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-white transition-colors rounded-lg"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className={`block w-5 h-0.5 bg-current transition-all origin-center ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
            <span className={`block w-5 h-0.5 bg-current transition-all ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-current transition-all origin-center ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu below navbar */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
          <div className="px-4 py-4 space-y-4">
            <nav className="space-y-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={[
                    "block rounded-2xl px-4 py-3 text-lg font-medium transition-all",
                    isActive(link.href)
                      ? "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800",
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="grid gap-3">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-center gap-2 h-12 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                {theme === "dark" ? <SunIcon /> : <MoonIcon />}
                {theme === "dark" ? "Light mode" : "Dark mode"}
              </button>
              <button className="w-full flex items-center justify-center gap-2 h-12 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
                </svg>
                EN / ភ្នំពេញ
              </button>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-700" />

            <div className="grid gap-3 pt-2">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="w-full inline-flex items-center justify-center h-12 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                Log in
              </Link>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="w-full inline-flex items-center justify-center h-12 rounded-2xl bg-violet-600 text-white font-semibold hover:bg-violet-500 transition-colors"
              >
                Get started free
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}