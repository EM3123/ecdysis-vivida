import { useEffect, useRef, useState } from "react";
import { List, X } from "lucide-react";
import { SECTIONS } from "./sections.js";

/**
 * The jump-to control for viewports too narrow for the rail. It rides inside the
 * nav that already exists rather than adding a second bar, and the panel is
 * anchored under it so nothing is pinned to the bottom of the screen.
 */
export default function ContentsMenu({ active, onJump }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointer = (e) => {
      if (!wrap.current?.contains(e.target)) setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div ref={wrap} className="relative lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="contents-panel"
        className="flex items-center gap-1.5 border border-bone-200 px-2.5 py-1.5 text-xs tracking-widest text-ink-700 uppercase transition-colors hover:bg-bone-100"
      >
        {open ? <X size={13} /> : <List size={13} />}
        Contents
      </button>

      {open && (
        <div
          id="contents-panel"
          className="absolute right-0 mt-2 w-64 border border-bone-200 bg-bone-50 p-2 shadow-lg"
        >
          <ul>
            {SECTIONS.map((s) => {
              const on = s.id === active;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onJump(s.id);
                      setOpen(false);
                    }}
                    aria-current={on ? "true" : undefined}
                    className={`flex w-full items-baseline gap-2.5 px-2.5 py-2 text-left text-sm transition-colors ${
                      on
                        ? "bg-bone-100 font-medium text-ink-900"
                        : "text-ash-600 hover:bg-bone-100 hover:text-ink-800"
                    }`}
                  >
                    <span
                      className={`w-5 shrink-0 text-[10px] tracking-widest ${
                        on ? "text-gold-800" : "text-ash-600"
                      }`}
                    >
                      {s.numeral}
                    </span>
                    {s.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
