"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectCard, moveCard } from "@/lib/features/kanban/kanbanSlice";

const FEATURES = [
  { icon: (<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="2" y="2" width="5.5" height="18" rx="2" fill="currentColor" opacity=".9"/><rect x="9.5" y="2" width="10.5" height="12" rx="2" fill="currentColor" opacity=".5"/></svg>), title: "Kanban Boards", desc: "Drag cards across columns and see the whole project at a glance. Backlog to shipped, always in focus.", color: "#0052cc", bg: "#e9f2ff" },
  { icon: (<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="2" y="4" width="18" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="9.5" width="14" height="3" rx="1.5" fill="currentColor" opacity=".6"/><rect x="2" y="15" width="10" height="3" rx="1.5" fill="currentColor" opacity=".35"/></svg>), title: "Smart Lists", desc: "Filter, sort, and group tasks any way you need. Deadline view, priority view, assignee view — all instant.", color: "#216e4e", bg: "#dcfff1" },
  { icon: (<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="2" y="2" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2"/><path d="M6 11l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>), title: "Rich Task Cards", desc: "Each card holds checklists, due dates, attachments, comments, and assignees — everything in one place.", color: "#5e4db2", bg: "#f3f0ff" },
  { icon: (<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 2v4M11 16v4M2 11h4M16 11h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="11" cy="11" r="4" fill="currentColor" opacity=".3"/><circle cx="11" cy="11" r="2" fill="currentColor"/></svg>), title: "Automation", desc: "Let repetitive work handle itself. Set triggers and actions so your workflow runs on autopilot.", color: "#a54800", bg: "#fff3eb" },
  { icon: (<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="7" cy="7" r="4" stroke="currentColor" strokeWidth="2"/><circle cx="15" cy="15" r="4" stroke="currentColor" strokeWidth="2"/><path d="M11 7h6M7 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity=".5"/></svg>), title: "Team Workspaces", desc: "Invite teammates, assign tasks, and collaborate in shared workspaces with role-based permissions.", color: "#0055cc", bg: "#e9f2ff" },
  { icon: (<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 17l4-4 3 3 4-5 5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="2" y="2" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" opacity=".4"/></svg>), title: "Reports & Insights", desc: "Track velocity, spot blockers, and forecast delivery. Real-time charts that actually make sense.", color: "#ae2e24", bg: "#ffeceb" },
];

const TESTIMONIALS = [
  { name: "Sarah Chen", role: "Product Manager · Shopify", initials: "SC", color: "#0052cc", text: "TaskFlow transformed how our team ships features. We went from chaos to clarity in two weeks flat. Now every sprint is predictable." },
  { name: "Marcus Reid", role: "CTO · Vercel", initials: "MR", color: "#216e4e", text: "The Kanban view alone is worth switching for. Every engineer uses it daily. It replaced three other tools overnight." },
  { name: "Priya Nair", role: "Design Lead · Figma", initials: "PN", color: "#5e4db2", text: "Finally, a project tool designers actually enjoy. Flexible enough for creative work, structured enough for stakeholders." },
];

const PRICING = [
  { name: "Free",       price: "$0",     period: "/mo", cta: "Get started free", highlight: false, desc: "Perfect for individuals and small teams getting started.",         features: ["Unlimited cards", "10 boards", "Up to 2 members", "Basic automation", "7-day activity log"] },
  { name: "Pro",        price: "$10",    period: "/mo", cta: "Start free trial",  highlight: true,  desc: "For growing teams that need more power and flexibility.",         features: ["Unlimited boards", "Unlimited members", "Advanced automation", "Priority support", "Custom fields", "Timeline view"] },
  { name: "Enterprise", price: "Custom", period: "",    cta: "Contact sales",     highlight: false, desc: "For large organizations with compliance and security needs.",     features: ["Everything in Pro", "SSO & SAML", "Audit logs", "SLA guarantee", "Dedicated support", "Custom contracts"] },
];

const AV_COLORS: Record<string, string> = { SC: "#0052cc", MR: "#216e4e", PN: "#5e4db2" };
const PRIORITY_DOT: Record<string, string> = { high: "#ef4444", medium: "#f59e0b", low: "#22c55e" };

function KanbanDemo() {
  const dispatch = useAppDispatch();
  const { columns, selectedCard, selectedCardCol } = useAppSelector((s) => s.kanban);

  const handleCardClick = useCallback(
    (cardId: string, colId: string) => {
      if (selectedCard === cardId) dispatch(selectCard(null));
      else dispatch(selectCard({ cardId, colId }));
    },
    [dispatch, selectedCard]
  );

  const handleMove = useCallback(
    (toColId: string) => {
      if (!selectedCard || !selectedCardCol) return;
      dispatch(moveCard({ cardId: selectedCard, fromColId: selectedCardCol, toColId }));
    },
    [dispatch, selectedCard, selectedCardCol]
  );

  return (
    <div className="kb-demo-wrap">
      {/* Chrome */}
      <div className="kb-chrome">
        <div className="kb-dots">
          <span style={{ background: "#ff5f57" }} />
          <span style={{ background: "#febc2e" }} />
          <span style={{ background: "#28c840" }} />
        </div>
        <div className="kb-title-bar">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="4.5" height="12" rx="1.2" fill="#fff"/><rect x="8.5" y="2" width="5.5" height="8" rx="1.2" fill="#fff" opacity=".7"/></svg>
          <span>Website Redesign · Sprint 12</span>
        </div>
        <div className="kb-chrome-right">
          {["SC", "MR", "PN"].map((av, i) => (
            <div key={av} className="kb-av" style={{ background: AV_COLORS[av], marginLeft: i > 0 ? -8 : 0 }}>{av}</div>
          ))}
          <button className="kb-invite-btn">+ Invite</button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="kb-toolbar">
        <div className="kb-toolbar-left">
          <button className="kb-tb-btn kb-tb-btn--active">Board</button>
          <button className="kb-tb-btn">Timeline</button>
          <button className="kb-tb-btn">List</button>
        </div>
        <div className="kb-toolbar-right">
          <button className="kb-tb-btn">Filter</button>
          <button className="kb-tb-btn">+ Column</button>
        </div>
      </div>

      {/* Board */}
      <div className="kb-board">
        {columns.map((col) => (
          <div key={col.id} className="kb-col">
            <div className="kb-col-header">
              <div className="kb-col-left">
                <span className="kb-col-dot" style={{ background: col.dotColor }} />
                <span className="kb-col-label">{col.label}</span>
                <span className="kb-col-count">{col.cards.length}</span>
              </div>
              {selectedCard && selectedCardCol !== col.id && (
                <button className="kb-move-btn" onClick={() => handleMove(col.id)}>Move →</button>
              )}
            </div>
            <div className="kb-col-cards">
              {col.cards.map((card) => (
                <div
                  key={card.id}
                  className={`kb-card${selectedCard === card.id ? " kb-card--selected" : ""}${card.checked ? " kb-card--done" : ""}`}
                  onClick={() => handleCardClick(card.id, col.id)}
                >
                  {card.tag && (
                    <span className="kb-card-tag" style={{ background: card.tagBg, color: card.tagColor }}>{card.tag}</span>
                  )}
                  <p className={`kb-card-title${card.checked ? " kb-card-title--done" : ""}`}>{card.title}</p>
                  <div className="kb-card-footer">
                    <div className="kb-card-meta">
                      <span className="kb-priority-dot" style={{ background: PRIORITY_DOT[card.priority] }} />
                      {card.dueDate && <span className="kb-due">📅 {card.dueDate}</span>}
                    </div>
                    {card.avatar && (
                      <div className="kb-card-av" style={{ background: card.avatarColor }}>{card.avatar}</div>
                    )}
                  </div>
                </div>
              ))}
              <button className="kb-add-card">+ Add a card</button>
            </div>
          </div>
        ))}
      </div>

      {selectedCard && (
        <div className="kb-hint">
          <span>✨ Click <strong>Move →</strong> on another column to move this card</span>
          <button onClick={() => dispatch(selectCard(null))} className="kb-hint-close">✕</button>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className="lp-root">

      {/* NAV */}
      <nav className={`lp-nav${scrolled ? " lp-nav--scrolled" : ""}`}>
        <div className="lp-nav-inner">
          <Link href="/" className="lp-logo-wrap">
            <div className="lp-logo-mark">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="5" height="12" rx="1.5" fill="white"/><rect x="9" y="2" width="5" height="8" rx="1.5" fill="white" opacity=".8"/></svg>
            </div>
            <span className="lp-logo-text">TaskFlow</span>
          </Link>
          <div className="lp-nav-links">
            {["Features", "Templates", "Pricing", "Enterprise"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="lp-nav-link">{item}</a>
            ))}
          </div>
          <div className="lp-nav-actions">
            <Link href="/login" className="lp-btn-ghost">Log in</Link>
            <Link href="/register" className="lp-btn-primary lp-btn-sm">Get started free</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
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
            <Link href="/register" className="lp-btn-primary lp-btn-lg lp-btn-hero">Start for free — no credit card</Link>
            <Link href="/login" className="lp-btn-outline lp-btn-lg">
              Sign in to workspace
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>
          <p className="lp-hero-trust lp-anim-4">Trusted by 50,000+ teams at startups, agencies, and Fortune 500s</p>
          <div className="lp-demo-wrap lp-anim-5">
            <KanbanDemo />
          </div>
        </div>
      </section>

      {/* LOGOS */}
      <section className="lp-logos">
        <p className="lp-logos-label">Used by teams at the world&apos;s best companies</p>
        <div className="lp-logos-row">
          {["Shopify", "Vercel", "Stripe", "Figma", "Notion", "Linear", "GitHub", "Atlassian"].map((n) => (
            <span key={n} className="lp-logo-name">{n}</span>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="lp-section lp-section--white">
        <div className="lp-container">
          <div className="lp-section-header">
            <span className="lp-eyebrow lp-eyebrow--blue">The system</span>
            <h2 className="lp-section-title">Everything your team needs</h2>
            <p className="lp-section-sub">One platform to plan, track, and ship — without the complexity tax.</p>
          </div>
          <div className="lp-features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="lp-feature-card">
                <div className="lp-feature-icon" style={{ background: f.bg, color: f.color }}>{f.icon}</div>
                <h3 className="lp-feature-title">{f.title}</h3>
                <p className="lp-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="templates" className="lp-section lp-section--gray">
        <div className="lp-container">
          <div className="lp-hiw-grid">
            <div className="lp-hiw-content">
              <span className="lp-eyebrow lp-eyebrow--green">How it works</span>
              <h2 className="lp-section-title">From backlog to shipped<br/>in minutes</h2>
              <div className="lp-steps">
                {[
                  { num: "01", title: "Create your board",        desc: "Set up a project in seconds. Add columns to match exactly how your team works — no rigid templates." },
                  { num: "02", title: "Add cards for every task",  desc: "Each card holds everything: description, checklist, due date, files, and team conversations." },
                  { num: "03", title: "Move work forward",         desc: "Drag cards across columns as work progresses. Everyone sees the same source of truth, in real time." },
                ].map((s) => (
                  <div key={s.num} className="lp-step">
                    <div className="lp-step-num">{s.num}</div>
                    <div><h3 className="lp-step-title">{s.title}</h3><p className="lp-step-desc">{s.desc}</p></div>
                  </div>
                ))}
              </div>
              <Link href="/register" className="lp-btn-primary lp-btn-md" style={{ marginTop: 28, display: "inline-block" }}>Try it now →</Link>
            </div>
            <div className="lp-hiw-preview">
              <div className="lp-preview-header">
                <div className="lp-preview-dots"><span /><span /><span /></div>
                <span className="lp-preview-title">Sprint 12</span>
              </div>
              <div className="lp-preview-board">
                {[
                  { label: "To Do",       color: "#94a3b8", items: ["Research pricing", "Define OKRs", "Write tests"] },
                  { label: "In Progress", color: "#0052cc", items: ["Redesign onboarding", "API refactor"] },
                  { label: "Done",        color: "#22c55e", items: ["v2.4 release", "Nav bug fix"] },
                ].map((col, ci) => (
                  <div key={ci} className="lp-preview-col">
                    <div className="lp-preview-col-head">
                      <span className="lp-preview-dot" style={{ background: col.color }} />
                      <span className="lp-preview-col-label">{col.label}</span>
                      <span className="lp-preview-col-count">{col.items.length}</span>
                    </div>
                    {col.items.map((item, ii) => (
                      <div key={ii} className="lp-preview-card">{item}</div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="lp-section lp-section--white">
        <div className="lp-container">
          <div className="lp-section-header">
            <h2 className="lp-section-title">Loved by 50,000+ teams</h2>
            <p className="lp-section-sub">Don&apos;t take our word for it.</p>
          </div>
          <div className="lp-testi-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="lp-testi-card">
                <div className="lp-stars">{Array(5).fill(0).map((_, s) => (<svg key={s} width="14" height="14" viewBox="0 0 14 14" fill="#f59e0b"><path d="M7 1l1.545 3.09L12 4.635l-2.5 2.43.59 3.435L7 8.91l-3.09 1.59L4.5 7.065 2 4.635l3.455-.545z"/></svg>))}</div>
                <p className="lp-testi-text">&ldquo;{t.text}&rdquo;</p>
                <div className="lp-testi-author">
                  <div className="lp-testi-av" style={{ background: t.color }}>{t.initials}</div>
                  <div><p className="lp-testi-name">{t.name}</p><p className="lp-testi-role">{t.role}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="lp-section lp-section--dark">
        <div className="lp-container">
          <div className="lp-section-header">
            <h2 className="lp-section-title lp-section-title--white">Simple, honest pricing</h2>
            <p className="lp-section-sub lp-section-sub--muted">Start free. Upgrade when you need to.</p>
          </div>
          <div className="lp-pricing-grid">
            {PRICING.map((plan, i) => (
              <div key={i} className={`lp-pricing-card${plan.highlight ? " lp-pricing-card--highlight" : ""}`}>
                <p className="lp-plan-name" style={{ color: plan.highlight ? "#0052cc" : "#7c93d8" }}>{plan.name}</p>
                <div className="lp-plan-price">
                  <span className="lp-plan-amount" style={{ color: plan.highlight ? "#0a0a0a" : "#fff" }}>{plan.price}</span>
                  <span className="lp-plan-period" style={{ color: plan.highlight ? "#64748b" : "#7c93d8" }}>{plan.period}</span>
                </div>
                <p className="lp-plan-desc" style={{ color: plan.highlight ? "#64748b" : "#93afda" }}>{plan.desc}</p>
                <ul className="lp-plan-features">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="lp-plan-feature" style={{ color: plan.highlight ? "#374151" : "#cdd8f0" }}>
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2.5 7.5l3.5 3.5 6.5-7" stroke={plan.highlight ? "#0052cc" : "#4e8af0"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className={`lp-plan-cta${plan.highlight ? " lp-plan-cta--blue" : " lp-plan-cta--ghost"}`}>{plan.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="lp-section lp-section--white">
        <div className="lp-cta-wrap">
          <div className="lp-cta-icon">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><rect x="3" y="3" width="8" height="20" rx="2.5" fill="white"/><rect x="14" y="3" width="9" height="13" rx="2.5" fill="white" opacity=".75"/></svg>
          </div>
          <h2 className="lp-cta-title">Get your team on the same page</h2>
          <p className="lp-cta-sub">Join 50,000+ teams who plan, track, and ship faster with TaskFlow.</p>
          <div className="lp-cta-btns">
            <Link href="/register" className="lp-btn-primary lp-btn-lg">Start for free</Link>
            <Link href="/login" className="lp-btn-outline lp-btn-lg">Sign in</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-brand">
            <div className="lp-logo-mark lp-logo-mark--sm">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="5" height="12" rx="1.5" fill="white"/><rect x="9" y="2" width="5" height="8" rx="1.5" fill="white" opacity=".8"/></svg>
            </div>
            <span className="lp-footer-name">TaskFlow</span>
            <span className="lp-footer-copy">© {new Date().getFullYear()}</span>
          </div>
          <div className="lp-footer-links">
            {["Privacy", "Terms", "Security", "Status", "Help"].map((item) => (
              <a key={item} href="#" className="lp-footer-link">{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
