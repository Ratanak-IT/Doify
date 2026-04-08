"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/NavBar";

export default function AboutPage() {
  const teachers = [
    { name: "Mr. John Smith",  subject: "Computer Science",   img: "https://randomuser.me/api/portraits/men/11.jpg" },
    { name: "Ms. Sarah Lee",   subject: "UI/UX Design",       img: "https://randomuser.me/api/portraits/women/44.jpg" },
    { name: "Mr. David Kim",   subject: "Project Management", img: "https://randomuser.me/api/portraits/men/52.jpg" },
  ];

  const team = [
    { name: "Simon Monroe", role: "Founder & CEO",     img: "https://randomuser.me/api/portraits/men/32.jpg" },
    { name: "Robert Todd",  role: "Software Engineer", img: "https://randomuser.me/api/portraits/men/45.jpg" },
    { name: "Ted Norton",   role: "Sales Manager",     img: "https://randomuser.me/api/portraits/men/65.jpg" },
  ];

  const stats = [
    { value: "50K+",  label: "Teams using TaskFlow" },
    { value: "120+",  label: "Countries reached" },
    { value: "99.9%", label: "Uptime SLA" },
    { value: "4.9★",  label: "Average rating" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:        #eef2f7;
          --bg-card:   #ffffff;
          --purple:    #6c47ff;
          --purple-dk: #5535e0;
          --purple-lt: #ede9ff;
          --text:      #1a1a2e;
          --muted:     #6b7280;
          --border:    #e2e8f0;
          --radius:    12px;
          --font:      'Inter', sans-serif;
        }

        body { font-family: var(--font); background: var(--bg); color: var(--text); }

        /* ── HERO ── */
        .hero { text-align: center; padding: 72px 24px 60px; }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: white; border: 1px solid var(--border);
          border-radius: 99px; padding: 6px 16px;
          font-size: 0.8rem; font-weight: 500; color: var(--muted); margin-bottom: 28px;
        }
        .hero-badge-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--purple); }
        .hero h1 {
          font-size: clamp(2.2rem, 5vw, 3.4rem); font-weight: 800;
          letter-spacing: -1.5px; line-height: 1.15; color: var(--text); margin-bottom: 8px;
        }
        .hero h1 span { color: var(--purple); }
        .hero-sub {
          font-size: clamp(1.2rem, 3vw, 1.8rem); font-weight: 600;
          color: var(--muted); margin-bottom: 16px;
        }
        .hero p { font-size: 1rem; color: var(--muted); max-width: 500px; margin: 0 auto 28px; line-height: 1.75; }
        .hero-cta {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 28px; border-radius: 99px; border: none;
          background: var(--purple); color: white;
          font-family: var(--font); font-size: 0.95rem; font-weight: 600;
          cursor: pointer; transition: background 0.15s, transform 0.1s;
        }
        .hero-cta:hover { background: var(--purple-dk); transform: translateY(-1px); }

        .hero-img-wrap {
          margin: 48px auto 0; max-width: 960px;
          border-radius: 16px; overflow: hidden;
          border: 1px solid var(--border);
          box-shadow: 0 20px 60px rgba(108,71,255,0.1), 0 4px 16px rgba(0,0,0,0.06);
        }
        .hero-img-wrap img { width: 100%; height: 380px; object-fit: cover; display: block; }

        /* ── STATS STRIP ── */
        .stats-strip {
          background: var(--bg-card); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
          padding: 36px 24px;
        }
        .stats-inner {
          max-width: 860px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; text-align: center;
        }
        .stat-value { font-size: 1.9rem; font-weight: 800; color: var(--purple); letter-spacing: -1px; }
        .stat-label { font-size: 0.8rem; color: var(--muted); margin-top: 4px; }

        /* ── SECTION SHARED ── */
        .section { padding: 80px 24px; }
        .section-tag {
          display: inline-block;
          font-size: 0.72rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--purple); background: var(--purple-lt);
          padding: 4px 12px; border-radius: 99px; margin-bottom: 14px;
        }
        .section-title {
          font-size: clamp(1.6rem, 3.5vw, 2.4rem); font-weight: 800;
          letter-spacing: -0.8px; color: var(--text); margin-bottom: 8px; line-height: 1.2;
        }
        .section-title span { color: var(--purple); }
        .section-desc { font-size: 0.95rem; color: var(--muted); max-width: 480px; line-height: 1.7; }
        .section-header { text-align: center; margin-bottom: 56px; }
        .section-header .section-desc { margin: 0 auto; }

        /* ── TEACHERS GRID ── */
        .teachers-section { background: var(--bg); }
        .cards-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; max-width: 960px; margin: 0 auto; }

        .teacher-card {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: var(--radius); padding: 32px 24px; text-align: center;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .teacher-card:hover { box-shadow: 0 8px 32px rgba(108,71,255,0.12); transform: translateY(-4px); }
        .teacher-card img {
          width: 96px; height: 96px; border-radius: 50%; object-fit: cover;
          margin: 0 auto 16px; display: block;
          border: 3px solid var(--purple-lt);
        }
        .teacher-card h4 { font-weight: 700; font-size: 1rem; margin-bottom: 4px; }
        .teacher-card p { font-size: 0.82rem; color: var(--purple); font-weight: 500; }

        /* ── TEAM GRID ── */
        .team-section { background: var(--bg-card); }
        .team-card { text-align: center; }
        .team-card img {
          width: 100px; height: 100px; border-radius: 50%; object-fit: cover;
          margin: 0 auto 16px; display: block;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .team-card h4 { font-weight: 700; font-size: 1rem; margin-bottom: 4px; }
        .team-card p { font-size: 0.82rem; color: var(--muted); margin-bottom: 14px; }
        .team-social { display: flex; justify-content: center; gap: 8px; }
        .team-social-btn {
          width: 30px; height: 30px; border-radius: 7px;
          border: 1px solid var(--border); background: var(--bg);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.15s, border-color 0.15s; color: var(--muted);
        }
        .team-social-btn:hover { background: var(--purple-lt); border-color: var(--purple); color: var(--purple); }
        .team-social-btn svg { width: 13px; height: 13px; fill: currentColor; }

        /* ── FOOTER ── */
        .footer {
          background: #ffffff; border-top: 1px solid #e2e8f0;
          color: #6b7280; padding: 56px 32px 32px; font-family: 'Inter', sans-serif;
        }
        .footer-inner {
          max-width: 1100px; margin: 0 auto;
          display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 40px; margin-bottom: 40px;
        }
        .footer-brand-name { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
        .footer-logo-icon { width: 32px; height: 32px; border-radius: 8px; background: #6c47ff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .footer-brand-text { font-weight: 700; font-size: 1rem; color: #1a1a2e; }
        .footer-brand-desc { font-size: 0.82rem; line-height: 1.65; color: #6b7280; max-width: 240px; }
        .footer-social { display: flex; gap: 10px; margin-top: 20px; }
        .footer-social-btn { width: 34px; height: 34px; border-radius: 8px; background: #eef2f7; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #6b7280; transition: background 0.15s, color 0.15s, border-color 0.15s; }
        .footer-social-btn:hover { background: #ede9ff; color: #6c47ff; border-color: #6c47ff; }
        .footer-social-btn svg { width: 15px; height: 15px; fill: currentColor; }
        .footer-col h4 { font-size: 0.75rem; font-weight: 600; color: #1a1a2e; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 16px; }
        .footer-col ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
        .footer-col ul li a { font-size: 0.83rem; color: #6b7280; text-decoration: none; transition: color 0.15s; }
        .footer-col ul li a:hover { color: #6c47ff; }
        .footer-divider { border: none; border-top: 1px solid #e2e8f0; max-width: 1100px; margin: 0 auto 24px; }
        .footer-bottom { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
        .footer-copy { font-size: 0.75rem; color: #94a3b8; }

        @media (max-width: 860px) {
          .cards-grid { grid-template-columns: 1fr; max-width: 400px; }
          .footer-inner { grid-template-columns: 1fr 1fr; }
          .stats-inner { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 540px) {
          .footer-inner { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ✅ Shared Navbar — replaces the old inline <nav> */}
      <Navbar />

      {/* HERO */}
      <motion.section className="hero" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="hero-badge">
          <div className="hero-badge-dot" />
          Trusted by 50,000+ teams worldwide
        </div>
        <h1>Built to keep your <span>team on track,</span></h1>
        <p className="hero-sub">Every task. Every deadline. Every sprint.</p>
        <p>
          TaskFlow is a modern task management platform designed to help teams
          plan smarter, collaborate in real time, and ship work without the chaos.
          From daily to-dos to full project pipelines — we&apos;ve got it covered.
        </p>
        <button className="hero-cta">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M20 7H4M16 3l4 4-4 4M4 17h16M8 13l-4 4 4 4" />
          </svg>
          We&apos;re Hiring Now
        </button>
        <div className="hero-img-wrap">
          <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80" alt="TaskFlow team at work" />
        </div>
      </motion.section>

      {/* STATS */}
      <div className="stats-strip">
        <div className="stats-inner">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.4 }}>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ADVISORS */}
      <section className="section teachers-section">
        <div className="section-header">
          <span className="section-tag">Our Advisors</span>
          <h2 className="section-title">Guided by <span>Industry Experts</span></h2>
          <p className="section-desc">
            Our advisors bring deep expertise in productivity tools, software engineering,
            and agile project management — shaping TaskFlow into a world-class platform.
          </p>
        </div>
        <div className="cards-grid">
          {teachers.map((t, i) => (
            <motion.div key={i} className="teacher-card" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.4 }}>
              <img src={t.img} alt={t.name} />
              <h4>{t.name}</h4>
              <p>{t.subject}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TEAM */}
      <section className="section team-section">
        <div className="section-header">
          <span className="section-tag">Our Team</span>
          <h2 className="section-title">The people <span>behind TaskFlow</span></h2>
          <p className="section-desc">
            We&apos;re a small, passionate team obsessed with making task management
            feel effortless. We believe great software should get out of your way
            and let you focus on what actually matters — doing the work.
          </p>
        </div>
        <div className="cards-grid">
          {team.map((m, i) => (
            <motion.div key={i} className="team-card" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.4 }}>
              <img src={m.img} alt={m.name} />
              <h4>{m.name}</h4>
              <p>{m.role}</p>
              <div className="team-social">
                <button className="team-social-btn" aria-label="Twitter">
                  <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                </button>
                <button className="team-social-btn" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                </button>
                <button className="team-social-btn" aria-label="Instagram">
                  <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div className="footer-brand-name">
              <div className="footer-logo-icon">
                <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
                  <path d="M3 5h14M3 10h10M3 15h7" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </div>
              <span className="footer-brand-text">TaskFlow</span>
            </div>
            <p className="footer-brand-desc">Simplifying teamwork and productivity for everyone, everywhere.</p>
            <div className="footer-social">
              <button className="footer-social-btn" aria-label="Twitter">
                <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </button>
              <button className="footer-social-btn" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              </button>
              <button className="footer-social-btn" aria-label="Globe">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
                </svg>
              </button>
            </div>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="#">Careers</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <ul>
              <li><Link href="#">Blog</Link></li>
              <li><Link href="#">Help Center</Link></li>
              <li><Link href="#">Privacy Policy</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Product</h4>
            <ul>
              <li><Link href="#">Features</Link></li>
              <li><Link href="#">Pricing</Link></li>
              <li><Link href="#">Changelog</Link></li>
            </ul>
          </div>
        </div>
        <hr className="footer-divider" />
        <div className="footer-bottom">
          <span className="footer-copy">© 2026 TaskFlow. All rights reserved.</span>
          <span className="footer-copy">Made with ♥ in Phnom Penh</span>
        </div>
      </footer>
    </>
  );
}