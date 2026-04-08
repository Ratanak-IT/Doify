"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { label: "Home",       href: "/" },
    { label: "Contact Us", href: "/contact" },
    { label: "About Us",   href: "/about" },
  ];

  return (
    <nav className={`lp-nav${scrolled ? " lp-nav--scrolled" : ""}`}>
      <div className="lp-nav-inner">

        {/* Logo */}
        <Link href="/" className="lp-logo-wrap">
          <div className="lp-logo-mark">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5"  height="12" rx="1.5" fill="white" />
              <rect x="9" y="2" width="5"  height="8"  rx="1.5" fill="white" opacity=".8" />
            </svg>
          </div>
          <span className="lp-logo-text">TaskFlow</span>
        </Link>

        {/* Nav links — using the links array, not a second inline array */}
        <div className="lp-nav-links">
          {links.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`lp-nav-link${pathname === href ? " lp-nav-link--active" : ""}`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="lp-nav-actions">
          <Link href="/login"    className="lp-btn-ghost">Log in</Link>
          <Link href="/register" className="lp-btn-primary lp-btn-sm">
            Get started free
          </Link>
        </div>

      </div>
    </nav>
  );
}