
const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Product Manager · Shopify",
    initials: "SC",
    color: "#6C5CE7",
    text: "TaskFlow transformed how our team ships features. We went from chaos to clarity in two weeks flat. Now every sprint is predictable.",
  },
  {
    name: "Marcus Reid",
    role: "CTO · Vercel",
    initials: "MR",
    color: "#216e4e",
    text: "The Kanban view alone is worth switching for. Every engineer uses it daily. It replaced three other tools overnight.",
  },
  {
    name: "Priya Nair",
    role: "Design Lead · Figma",
    initials: "PN",
    color: "#5e4db2",
    text: "Finally, a project tool designers actually enjoy. Flexible enough for creative work, structured enough for stakeholders.",
  },
];

export default function Testimonials() {
  return (
    <section className="lp-section lp-section--white">
      <div className="lp-container">
        <div className="lp-section-header">
          <h2 className="lp-section-title">Loved by 50,000+ teams</h2>
          <p className="lp-section-sub">Don&apos;t take our word for it.</p>
        </div>

        <div className="lp-testi-grid">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="lp-testi-card">
              <div className="lp-stars">
                {Array(5)
                  .fill(0)
                  .map((_, s) => (
                    <svg key={s} width="14" height="14" viewBox="0 0 14 14" fill="#f59e0b">
                      <path d="M7 1l1.545 3.09L12 4.635l-2.5 2.43.59 3.435L7 8.91l-3.09 1.59L4.5 7.065 2 4.635l3.455-.545z" />
                    </svg>
                  ))}
              </div>
              <p className="lp-testi-text">&ldquo;{t.text}&rdquo;</p>
              <div className="lp-testi-author">
                <div className="lp-testi-av" style={{ background: t.color }}>
                  {t.initials}
                </div>
                <div>
                  <p className="lp-testi-name">{t.name}</p>
                  <p className="lp-testi-role">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}