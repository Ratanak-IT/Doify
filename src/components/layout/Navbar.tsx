"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">

    <nav className={`lp-nav${scrolled ? " lp-nav--scrolled" : ""}`}>
      <div className="lp-nav-inner ">
        <Link href="/" className="lp-logo-wrap">
          <div className="lp-logo-mark">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="12" rx="1.5" fill="white" />
              <rect x="9" y="2" width="5" height="8" rx="1.5" fill="white" opacity=".8" />
            </svg>
          </div>
          <span className="lp-logo-text">TaskFlow</span>
        </Link>

        <div className="lp-nav-links">
          {["Features", "Templates", "Pricing", "Enterprise"].map((item) => (
              <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="lp-nav-link"
              >
              {item}
            </a>
          ))}
        </div>

        <div className="lp-nav-actions">
          <Link href="/login" className="lp-btn-ghost">Log in</Link>
          <Link href="/register" className="lp-btn-primary lp-btn-sm">
            Get started free
          </Link>
        </div>
      </div>
    </nav>
          </header>
  );
}