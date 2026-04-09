
export default function Logos() {
  return (
    <section className="lp-logos">
      <p className="lp-logos-label">Used by teams at the world&apos;s best companies</p>
      <div className="lp-logos-row">
        {["Shopify", "Vercel", "Stripe", "Figma", "Notion", "Linear", "GitHub", "Atlassian"].map((n) => (
          <span key={n} className="lp-logo-name">{n}</span>
        ))}
      </div>
    </section>
  );
}