"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/NavBar";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (form.name && form.email && form.message) setSubmitted(true);
  };

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
        .hero { text-align: center; padding: 72px 24px 52px; }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: white; border: 1px solid var(--border);
          border-radius: 99px; padding: 6px 16px;
          font-size: 0.8rem; font-weight: 500; color: var(--muted);
          margin-bottom: 28px;
        }
        .hero-badge-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--purple); }
        .hero h1 {
          font-size: clamp(2.2rem, 5vw, 3.4rem);
          font-weight: 800; letter-spacing: -1.5px; line-height: 1.15;
          color: var(--text); margin-bottom: 16px;
        }
        .hero h1 span { color: var(--purple); }
        .hero p { font-size: 1rem; color: var(--muted); max-width: 500px; margin: 0 auto; line-height: 1.75; }

        /* ── CONTACT GRID ── */
        .contact-wrap {
          max-width: 1060px; margin: 0 auto;
          padding: 0 24px 100px;
          display: grid;
          grid-template-columns: 1fr 1.7fr;
          gap: 24px; align-items: start;
        }

        /* Info cards */
        .info-stack { display: flex; flex-direction: column; gap: 16px; }
        .info-card {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: var(--radius); padding: 22px;
        }
        .info-card-icon {
          width: 38px; height: 38px; border-radius: 9px;
          background: var(--purple-lt);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 12px;
        }
        .info-card-icon svg { width: 19px; height: 19px; color: var(--purple); }
        .info-card h3 { font-size: 0.88rem; font-weight: 600; margin-bottom: 5px; }
        .info-card p { font-size: 0.82rem; color: var(--muted); line-height: 1.6; }
        .info-card a {
          display: inline-block; margin-top: 6px;
          font-size: 0.82rem; font-weight: 500; color: var(--purple); text-decoration: none;
        }
        .info-card a:hover { text-decoration: underline; }

        .social-row { display: flex; gap: 8px; margin-top: 10px; }
        .social-btn {
          width: 32px; height: 32px; border-radius: 7px;
          border: 1px solid var(--border); background: var(--bg);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.15s, border-color 0.15s;
          color: var(--muted);
        }
        .social-btn:hover { background: var(--purple-lt); border-color: var(--purple); color: var(--purple); }
        .social-btn svg { width: 14px; height: 14px; fill: currentColor; }

        /* Form card */
        .form-card {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: var(--radius); padding: 36px;
        }
        .form-card h2 { font-size: 1.3rem; font-weight: 700; letter-spacing: -0.4px; margin-bottom: 5px; }
        .form-card-sub { font-size: 0.84rem; color: var(--muted); margin-bottom: 28px; }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
        .field { display: flex; flex-direction: column; gap: 6px; }
        .field label { font-size: 0.78rem; font-weight: 600; color: var(--text); }
        .field input, .field textarea {
          padding: 10px 14px;
          border: 1.5px solid var(--border); border-radius: 8px;
          background: var(--bg); font-family: var(--font);
          font-size: 0.88rem; color: var(--text);
          outline: none; transition: border-color 0.15s, background 0.15s; resize: none;
        }
        .field input:focus, .field textarea:focus { border-color: var(--purple); background: white; }
        .field input::placeholder, .field textarea::placeholder { color: #adb5bd; }
        .field--full { margin-bottom: 16px; }

        .form-submit {
          margin-top: 8px;
          display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;
        }
        .form-submit-note { font-size: 0.75rem; color: var(--muted); }
        .submit-btn {
          padding: 11px 26px; border-radius: 8px; border: none;
          background: var(--purple); color: white;
          font-family: var(--font); font-size: 0.9rem; font-weight: 600;
          cursor: pointer; transition: background 0.15s, transform 0.1s;
          display: flex; align-items: center; gap: 8px;
        }
        .submit-btn:hover { background: var(--purple-dk); transform: translateY(-1px); }
        .submit-btn svg { width: 16px; height: 16px; fill: none; stroke: white; stroke-width: 2.5; }

        /* Success */
        .success-box { text-align: center; padding: 52px 24px; }
        .success-icon {
          width: 54px; height: 54px; border-radius: 50%; background: var(--purple-lt);
          margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;
        }
        .success-icon svg { width: 26px; height: 26px; }
        .success-box h3 { font-size: 1.2rem; font-weight: 700; margin-bottom: 8px; }
        .success-box p { font-size: 0.88rem; color: var(--muted); }

        /* Footer */
        .footer { background: white; border-top: 1px solid var(--border); padding: 28px 32px; }
        .footer-inner {
          max-width: 1180px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;
        }
        .footer-copy { font-size: 0.78rem; color: var(--muted); }
        .footer-links { display: flex; gap: 20px; }
        .footer-links a { font-size: 0.78rem; color: var(--muted); text-decoration: none; transition: color 0.15s; }
        .footer-links a:hover { color: var(--text); }

        @media (max-width: 720px) {
          .contact-wrap { grid-template-columns: 1fr; }
          .form-row { grid-template-columns: 1fr; }
          .form-card { padding: 24px; }
        }
      `}</style>

      {/* ✅ Shared Navbar — replaces the old inline <nav> */}
      <Navbar />

      {/* HERO */}
      <motion.section className="hero" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="hero-badge">
          <div className="hero-badge-dot" />
          We typically respond within 24 hours
        </div>
        <h1>Get in <span>touch</span> with us</h1>
        <p>Have a question, feedback, or just want to say hello? We&apos;d love to hear from you — our team is ready to help.</p>
      </motion.section>

      {/* GRID */}
      <div className="contact-wrap">

        {/* Info cards */}
        <div className="info-stack">
          <motion.div className="info-card" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
            <div className="info-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/>
              </svg>
            </div>
            <h3>Email us</h3>
            <p>Send us an email and we&apos;ll get back to you as soon as possible.</p>
            <a href="mailto:support@taskflow.com">support@taskflow.com</a>
          </motion.div>

          <motion.div className="info-card" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17, duration: 0.4 }}>
            <div className="info-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
            </div>
            <h3>Our office</h3>
            <p>Phnom Penh, Cambodia<br/>Mon – Fri, 9:00 AM – 6:00 PM (ICT)</p>
          </motion.div>

          <motion.div className="info-card" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24, duration: 0.4 }}>
            <div className="info-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
            </div>
            <h3>Follow us</h3>
            <p>Stay up to date with product updates and news.</p>
            <div className="social-row">
              <button className="social-btn" aria-label="Twitter">
                <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </button>
              <button className="social-btn" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </button>
              <button className="social-btn" aria-label="Instagram">
                <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Form card */}
        <motion.div className="form-card" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14, duration: 0.5 }}>
          {submitted ? (
            <div className="success-box">
              <div className="success-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" color="var(--purple)">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
              <h3>Message sent!</h3>
              <p>Thanks for reaching out. We&apos;ll get back to you within 24 hours.</p>
            </div>
          ) : (
            <>
              <h2>Send us a message</h2>
              <p className="form-card-sub">Fill out the form below and we&apos;ll be in touch soon.</p>

              <div className="form-row">
                <div className="field">
                  <label>Your name</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" />
                </div>
                <div className="field">
                  <label>Email address</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@example.com" />
                </div>
              </div>

              <div className="field field--full">
                <label>Subject</label>
                <input type="text" name="subject" value={form.subject} onChange={handleChange} placeholder="What's this about?" />
              </div>

              <div className="field field--full">
                <label>Message</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={6} placeholder="Tell us how we can help…" />
              </div>

              <div className="form-submit">
                <span className="form-submit-note">We&apos;ll never share your info with anyone.</span>
                <button className="submit-btn" onClick={handleSubmit}>
                  Send message
                  <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* FOOTER */}
      <style>{`
        .footer {
          background: #ffffff;
          border-top: 1px solid #e2e8f0;
          color: #6b7280;
          padding: 56px 32px 32px;
          font-family: 'Inter', sans-serif;
        }
        .footer-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
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
        @media (max-width: 860px) { .footer-inner { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 480px) { .footer-inner { grid-template-columns: 1fr; } .footer-bottom { flex-direction: column; align-items: flex-start; } }
      `}</style>

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