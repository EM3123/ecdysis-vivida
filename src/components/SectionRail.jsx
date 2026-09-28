import { SECTIONS } from "./sections.js";

/**
 * The jump-to rail. It lives in the page margin at the right, which keeps the top
 * and bottom edges of the screen clear. Labels are absolutely positioned so the
 * rail itself stays the width of a dash and never reserves room for its own text.
 */
export default function SectionRail({ active, onJump }) {
  return (
    <nav
      aria-label="Jump to section"
      className="fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 lg:block"
    >
      <ul className="space-y-3.5">
        {SECTIONS.map((s) => {
          const on = s.id === active;
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onJump(s.id)}
                aria-current={on ? "true" : undefined}
                className="group relative flex h-4 w-7 cursor-pointer items-center justify-end"
              >
                <span className="pointer-events-none absolute right-full mr-3 rounded-sm border border-bone-200 bg-bone-50/95 px-2 py-1 font-sans text-[11px] tracking-wide whitespace-nowrap text-ink-700 opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">
                  {s.numeral ? `${s.numeral}. ${s.label}` : s.label}
                </span>
                <span
                  className={`block h-[3px] rounded-full transition-all duration-200 ${
                    on
                      ? "w-7 bg-gold-600"
                      : "w-2.5 bg-ash-400 group-hover:w-5 group-hover:bg-gold-800"
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
