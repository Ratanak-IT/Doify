import Link from "next/link";

export default function Footer() {
  return (
    <footer className="lp-footer">
      <div className="lp-footer-inner">
        <div className="lp-footer-brand">
          <Link href="/" className="flex items-center gap-3">
            <div className="lp-logo-mark lp-logo-mark--sm">
              <img src="/logo-doify.png" alt="Doify Logo" className="h-full w-full object-contain" />
            </div>
            <div>
              <span className="lp-footer-name">Doify</span>
              <p className="lp-footer-brand-copy">
                Professional task management for teams, projects, and workflows.
              </p>
            </div>
          </Link>
        </div>

        <div className="lp-footer-nav">
          <div className="lp-footer-section">
            <p className="lp-footer-title">Website</p>
            <div className="lp-footer-stack">
              <Link href="/" className="lp-footer-link">Home</Link>
              <Link href="/#features" className="lp-footer-link">Features</Link>
              <Link href="/#pricing" className="lp-footer-link">Pricing</Link>
              <Link href="/#testimonials" className="lp-footer-link">Testimonials</Link>
              <Link href="/contact" className="lp-footer-link">Contact</Link>
            </div>
          </div>

          <div className="lp-footer-section">
            <p className="lp-footer-title">Task Manager</p>
            <div className="lp-footer-stack">
              <Link href="/#features" className="lp-footer-link">For Teams</Link>
              <Link href="/#features" className="lp-footer-link">Workflows</Link>
              <Link href="/#features" className="lp-footer-link">Security</Link>
              <Link href="/#features" className="lp-footer-link">Integrations</Link>
              <Link href="/contact" className="lp-footer-link">Support</Link>
            </div>
          </div>

          <div className="lp-footer-section">
            <p className="lp-footer-title">Legal</p>
            <div className="lp-footer-stack">
              <Link href="/contact" className="lp-footer-link">Privacy</Link>
              <Link href="/contact" className="lp-footer-link">Terms</Link>
              <Link href="/contact" className="lp-footer-link">Status</Link>
              <Link href="/contact" className="lp-footer-link">Help</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="lp-footer-bottom">
        <span>
          © {new Date().getFullYear()} Doify — Professional task management for teams and managers.
        </span>
      </div>
    </footer>
  );
}