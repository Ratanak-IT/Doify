
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="lp-section lp-section--white">
      <div className="lp-cta-wrap">
        <div className="lp-cta-icon">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <rect x="3" y="3" width="8" height="20" rx="2.5" fill="white" />
            <rect x="14" y="3" width="9" height="13" rx="2.5" fill="white" opacity=".75" />
          </svg>
        </div>

        <h2 className="lp-cta-title">Get your team on the same page</h2>
        <p className="lp-cta-sub">Join 50,000+ teams who plan, track, and ship faster with TaskFlow.</p>

        <div className="lp-cta-btns">
          <Link href="/register" className="lp-btn-primary lp-btn-lg">
            Start for free
          </Link>
          <Link href="/login" className="lp-btn-outline lp-btn-lg">
            Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}