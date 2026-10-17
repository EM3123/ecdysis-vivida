import { Link, useLocation } from "react-router-dom";

// Shared top bar. The investor route is deliberately absent — it is unlisted,
// reachable only by direct link.
const LINKS = [
  { to: "/consumer", label: "The band" },
  { to: "/research", label: "Research" },
];

export default function SiteNav({ right = null }) {
  const { pathname } = useLocation();

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-bone-200 bg-bone-50/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6 font-sans">
        <Link to="/" className="flex items-center gap-3">
          <span className="text-sm font-semibold tracking-widest uppercase">
            Ecdysis
          </span>
          <span className="text-gold-800">/</span>
          <span className="text-sm tracking-wide text-ash-600">Vivida</span>
        </Link>

        <div className="flex items-center gap-5">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              aria-current={pathname === l.to ? "page" : undefined}
              className={`text-xs tracking-widest uppercase transition-colors ${
                pathname === l.to
                  ? "text-ink-900"
                  : "text-ash-600 hover:text-ink-800"
              }`}
            >
              {l.label}
            </Link>
          ))}
          {right}
        </div>
      </div>
    </nav>
  );
}
