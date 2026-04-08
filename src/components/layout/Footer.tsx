

export default function Footer() {
  return (
    <footer className="lp-footer">
      <div className="lp-footer-inner">
        <div className="lp-footer-brand">
          <div className="lp-logo-mark lp-logo-mark--sm">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="12" rx="1.5" fill="white" />
              <rect x="9" y="2" width="5" height="8" rx="1.5" fill="white" opacity=".8" />
            </svg>
          </div>
          <span className="lp-footer-name">TaskFlow</span>
          <span className="lp-footer-copy">© {new Date().getFullYear()}</span>
        </div>

        <div className="lp-footer-links">
          {["Privacy", "Terms", "Security", "Status", "Help"].map((item) => (
            <a key={item} href="#" className="lp-footer-link">
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}