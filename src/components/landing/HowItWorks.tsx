export default function HowItWorks() {
  return (
    <section id="templates" className="lp-section lp-section--gray">
      <div className="lp-container">
        <div className="lp-hiw-grid">
          <div className="lp-hiw-content">
            <span className="lp-eyebrow lp-eyebrow--green">How it works</span>
            <h2 className="lp-section-title">From backlog to shipped<br />in minutes</h2>

            <div className="lp-steps">
              {[
                {
                  num: "01",
                  title: "Create your board",
                  desc: "Set up a project in seconds. Add columns to match exactly how your team works — no rigid templates.",
                },
                {
                  num: "02",
                  title: "Add cards for every task",
                  desc: "Each card holds everything: description, checklist, due date, files, and team conversations.",
                },
                {
                  num: "03",
                  title: "Move work forward",
                  desc: "Drag cards across columns as work progresses. Everyone sees the same source of truth, in real time.",
                },
              ].map((s) => (
                <div key={s.num} className="lp-step">
                  <div className="lp-step-num">{s.num}</div>
                  <div>
                    <h3 className="lp-step-title">{s.title}</h3>
                    <p className="lp-step-desc">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <a href="/register" className="lp-btn-primary lp-btn-md" style={{ marginTop: 28, display: "inline-block" }}>
              Try it now →
            </a>
          </div>

          <div className="lp-hiw-preview">
            <div className="lp-preview-header">
              <div className="lp-preview-dots">
                <span />
                <span />
                <span />
              </div>
              <span className="lp-preview-title">Sprint 12</span>
            </div>
            <div className="lp-preview-board">
              {[
                { label: "To Do", color: "#94a3b8", items: ["Research pricing", "Define OKRs", "Write tests"] },
                { label: "In Progress", color: "#6C5CE7", items: ["Redesign onboarding", "API refactor"] },
                { label: "Done", color: "#22c55e", items: ["v2.4 release", "Nav bug fix"] },
              ].map((col, ci) => (
                <div key={ci} className="lp-preview-col">
                  <div className="lp-preview-col-head">
                    <span className="lp-preview-dot" style={{ background: col.color }} />
                    <span className="lp-preview-col-label">{col.label}</span>
                    <span className="lp-preview-col-count">{col.items.length}</span>
                  </div>
                  {col.items.map((item, ii) => (
                    <div key={ii} className="lp-preview-card">
                      {item}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}