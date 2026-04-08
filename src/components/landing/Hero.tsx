
"use client";

import Link from "next/link";
import KanbanDemo from "./KanbanDemo";


export default function Hero() {
  return (
    <section className="lp-hero">
      <div className="lp-hero-bg" />
      <div className="lp-hero-dots" />
      <div className="lp-hero-inner">
        <div className="lp-hero-badge lp-anim-1">
          <span className="lp-badge-dot" />
          Now with AI-powered automation
        </div>

        <h1 className="lp-hero-title lp-anim-2">
          Your team&apos;s work,<br />
          <span className="lp-shimmer">beautifully organized</span>
        </h1>

        <p className="lp-hero-sub lp-anim-3">
          Boards, lists, and cards — the most visual way to see everything about your project in one place, collaborate in real time, and actually get it done.
        </p>

        <div className="lp-hero-ctas lp-anim-4">
          <Link href="/register" className="lp-btn-primary lp-btn-lg lp-btn-hero">
            Start for free — no credit card
          </Link>
          <Link href="/login" className="lp-btn-outline lp-btn-lg">
            Sign in to workspace
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <p className="lp-hero-trust lp-anim-4">
          Trusted by 50,000+ teams at startups, agencies, and Fortune 500s
        </p>

        <div className="lp-demo-wrap lp-anim-5">
          <KanbanDemo />
        </div>
      </div>
    </section>
  );
}