
const PRICING = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    cta: "Get started free",
    highlight: false,
    desc: "Perfect for individuals and small teams getting started.",
    features: ["Unlimited cards", "10 boards", "Up to 2 members", "Basic automation", "7-day activity log"],
  },
  {
    name: "Pro",
    price: "$10",
    period: "/mo",
    cta: "Start free trial",
    highlight: true,
    desc: "For growing teams that need more power and flexibility.",
    features: ["Unlimited boards", "Unlimited members", "Advanced automation", "Priority support", "Custom fields", "Timeline view"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    cta: "Contact sales",
    highlight: false,
    desc: "For large organizations with compliance and security needs.",
    features: ["Everything in Pro", "SSO & SAML", "Audit logs", "SLA guarantee", "Dedicated support", "Custom contracts"],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="lp-section lp-section--dark">
      <div className="lp-container">
        <div className="lp-section-header">
          <h2 className="lp-section-title lp-section-title--white">Simple, honest pricing</h2>
          <p className="lp-section-sub lp-section-sub--muted">Start free. Upgrade when you need to.</p>
        </div>

        <div className="lp-pricing-grid">
          {PRICING.map((plan, i) => (
            <div key={i} className={`lp-pricing-card${plan.highlight ? " lp-pricing-card--highlight" : ""}`}>
              <p className="lp-plan-name" style={{ color: plan.highlight ? "#6C5CE7" : "#7c93d8" }}>
                {plan.name}
              </p>

              <div className="lp-plan-price">
                <span className="lp-plan-amount" style={{ color: plan.highlight ? "#0a0a0a" : "#fff" }}>
                  {plan.price}
                </span>
                <span className="lp-plan-period" style={{ color: plan.highlight ? "#64748b" : "#7c93d8" }}>
                  {plan.period}
                </span>
              </div>

              <p className="lp-plan-desc" style={{ color: plan.highlight ? "#64748b" : "#93afda" }}>
                {plan.desc}
              </p>

              <ul className="lp-plan-features">
                {plan.features.map((f, fi) => (
                  <li key={fi} className="lp-plan-feature" style={{ color: plan.highlight ? "#374151" : "#cdd8f0" }}>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                      <path
                        d="M2.5 7.5l3.5 3.5 6.5-7"
                        stroke={plan.highlight ? "#6C5CE7" : "#4e8af0"}
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="/register"
                className={`lp-plan-cta${plan.highlight ? " lp-plan-cta--blue" : " lp-plan-cta--ghost"}`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}