"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const integrationIcons = [
  {
    icon: "rebase_edit",
    color: "text-blue-600",
    label: "Project Management",
    delay: 100,
  },
  {
    icon: "terminal",
    color: "text-slate-900 dark:text-white",
    label: "Dev Tools",
    delay: 200,
  },
  {
    icon: "code",
    color: "text-orange-600",
    label: "Version Control",
    delay: 300,
  },
  { icon: "palette", color: "text-purple-600", label: "Design", delay: 400 },
  {
    icon: "event_note",
    color: "text-slate-800 dark:text-white",
    label: "Notes",
    delay: 500,
  },
  {
    icon: "grid_view",
    color: "text-blue-500",
    label: "Issue Tracker",
    delay: 600,
  },
  { icon: "chat", color: "text-pink-500", label: "Messaging", delay: 700 },
];

export default function IntegrationSection() {
  const archRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-arch");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    if (archRef.current) observer.observe(archRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        /* ── Material Symbols ─────────────────────────────────────────── */
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .material-symbols-outlined {
          font-family: 'Material Symbols Outlined';
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          line-height: 1;
          font-style: normal;
          display: inline-block;
          text-transform: none;
          letter-spacing: normal;
          word-wrap: normal;
          white-space: nowrap;
          direction: ltr;
          font-size: 24px;
        }

        /* ── Fade-in-up entrance ────────────────────────────────────────── */
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        /* ── Arch wrapper ───────────────────────────────────────────────── */
        .arch-wrapper {
          position: relative;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          overflow: visible;
        }
        @media (min-width: 1024px) {
          .arch-wrapper { height: 600px; }
        }

        /* ── Decorative arch background (desktop only) ──────────────────── */
        .arch-bg {
          display: none;
          position: absolute;
          bottom: -50px;
          left: 50%;
          transform: translateX(-50%);
          width: 1000px;
          height: 500px;
          border-radius: 500px 500px 0 0;
          background: radial-gradient(circle at 50% 100%, #ffffff 0%, rgba(255,255,255,.2) 70%, transparent 100%);
          box-shadow: 0 -20px 80px -20px rgba(0,0,0,.05);
          z-index: 1;
        }
        @media (min-width: 1024px) { .arch-bg { display: block; } }
        .dark .arch-bg {
          background: radial-gradient(circle at 50% 100%, #0f172a 0%, rgba(15,23,42,.2) 70%, transparent 100%);
          box-shadow: 0 -20px 80px -20px rgba(0,0,0,.3);
        }

        /* ── Icon items ─────────────────────────────────────────────────── */
        .arch-icon-item {
          width: 52px; height: 52px;
          background: white;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 24px -4px rgba(0,0,0,.08);
          border: 1px solid rgba(0,0,0,.05);
          z-index: 5;
          opacity: 0;
          transition: all 1s cubic-bezier(0.23, 1, 0.32, 1);
        }
        @media (min-width: 640px) {
          .arch-icon-item { width: 60px; height: 60px; border-radius: 14px; }
        }
        @media (min-width: 1024px) {
          .arch-icon-item {
            position: absolute;
            width: 64px; height: 64px; border-radius: 16px;
            left: 50%; top: 100%;
          }
        }
        .dark .arch-icon-item { background: #1e293b; border-color: rgba(255,255,255,.1); }
        .arch-icon-item span { font-size: 24px; }
        @media (min-width: 640px) { .arch-icon-item span { font-size: 28px; } }
        @media (min-width: 1024px) { .arch-icon-item span { font-size: 32px; } }

        /* ── Revealed state ─────────────────────────────────────────────── */
        .reveal-arch .arch-icon-item { opacity: 1; }

        /* Desktop arc positions */
        @media (min-width: 1024px) {
          .reveal-arch .icon-item-1 { transform: translate(-50%,-50%) rotate(210deg) translate(460px) rotate(-210deg); transition-delay: 100ms; }
          .reveal-arch .icon-item-2 { transform: translate(-50%,-50%) rotate(240deg) translate(460px) rotate(-240deg); transition-delay: 200ms; }
          .reveal-arch .icon-item-3 { transform: translate(-50%,-50%) rotate(270deg) translate(460px) rotate(-270deg); transition-delay: 300ms; }
          .reveal-arch .icon-item-4 { transform: translate(-50%,-50%) rotate(300deg) translate(460px) rotate(-300deg); transition-delay: 400ms; }
          .reveal-arch .icon-item-5 { transform: translate(-50%,-50%) rotate(330deg) translate(460px) rotate(-330deg); transition-delay: 500ms; }
          .reveal-arch .icon-item-6 { transform: translate(-50%,-50%) rotate(190deg) translate(460px) rotate(-190deg); transition-delay: 600ms; }
          .reveal-arch .icon-item-7 { transform: translate(-50%,-50%) rotate(350deg) translate(460px) rotate(-350deg); transition-delay: 700ms; }
        }

        /* Mobile / tablet grid */
        @media (max-width: 1023px) {
          .arch-icons-container {
            display: flex; flex-wrap: wrap;
            justify-content: center; align-items: center;
            gap: 0.75rem; margin-bottom: 3rem;
            max-width: 100%; padding: 0 1rem;
          }
          .arch-icon-item { transform: translateY(30px) scale(0.9); }
          .reveal-arch .arch-icon-item { transform: translateY(0) scale(1); }
          .icon-item-1 { transition-delay: 100ms; }
          .icon-item-2 { transition-delay: 150ms; }
          .icon-item-3 { transition-delay: 200ms; }
          .icon-item-4 { transition-delay: 250ms; }
          .icon-item-5 { transition-delay: 300ms; }
          .icon-item-6 { transition-delay: 350ms; }
          .icon-item-7 { transition-delay: 400ms; }
        }
        @media (min-width: 640px) and (max-width: 1023px) {
          .arch-icons-container { gap: 1.25rem; max-width: 600px; }
        }

        /* ── Central content block ──────────────────────────────────────── */
        .arch-content {
          position: relative; z-index: 10;
          text-align: center; padding-bottom: 20px;
          max-width: 700px; width: 100%;
        }
        @media (min-width: 1024px) { .arch-content { padding-bottom: 80px; } }

        /* ── CTA button using project primary #6C5CE7 ───────────────────── */
        .explore-btn {
          background: #6C5CE7;
          box-shadow: 0 10px 20px -5px rgba(108,92,231,.4);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .explore-btn:hover {
          transform: scale(1.05);
          background: #5B4BD5;
          box-shadow: 0 15px 25px -5px rgba(108,92,231,.5);
        }
        .explore-btn:active { transform: scale(0.98); }
      `}</style>

      <section
        className="relative py-12 sm:py-16 lg:py-24 overflow-hidden"
        id="integration-section"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="arch-wrapper" ref={archRef} id="arch-container">
            {/* Decorative arch background (desktop) */}
            <div className="arch-bg" />

            <div className="w-full flex flex-col items-center">
              {/* Icon grid */}
              <div className="arch-icons-container lg:contents">
                {integrationIcons.map((item, index) => (
                  <div
                    key={item.label}
                    className={`arch-icon-item icon-item-${index + 1}`}
                    aria-label={item.label}
                  >
                    <span className={`material-symbols-outlined ${item.color}`}>
                      {item.icon}
                    </span>
                  </div>
                ))}
              </div>

              {/* Central content */}
              <div className="arch-content animate-fade-in-up">
                {/* Heading */}
                <h2 className="text-xl sm:text-[36px] md:text-[42px] lg:text-4xl leading-[1.1] sm:leading-tight text-slate-900 dark:text-white mb-6 font-extrabold max-w-xl mx-auto tracking-tight">
                  Works With the Tools You Already Use
                </h2>

                {/* Subtext */}
                <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 text-center mb-6 sm:mb-8 max-w-sm sm:max-w-xl md:max-w-2xl leading-relaxed px-2 sm:px-0">
                  No new dashboards. No workflow changes. TaskSphere runs
                  silently in the background across your entire stack.
                </p>

                {/* CTA */}
                <div className="px-6 sm:px-0">
                  <Link
                    href="/dashboard"
                    className="explore-btn text-white px-8 py-3.5 sm:py-3 rounded-full font-bold text-sm tracking-wide w-auto min-h-[48px] cursor-pointer inline-flex items-center justify-center"
                  >
                    Explore Integrations
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
