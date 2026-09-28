import { motion } from "framer-motion";

// Every 100 adults with Type 1 diabetes in the BETTER registry. 58 do not wear a
// medical ID. The unit is a person, so the dots arrive one at a time.

const COLS = 10;
const ROWS = 10;
const GAP = 22;
const RADIUS = 7.5;
const PAD = 12;

const CELLS = Array.from({ length: COLS * ROWS }, (_, i) => ({
  i,
  x: PAD + (i % COLS) * GAP,
  y: PAD + Math.floor(i / COLS) * GAP,
  // The 42 who do wear one are seeded across the grid rather than blocked at the
  // end, so the eye reads a scatter of coverage instead of a bar on its side.
  wears: (i * 7) % 100 < 42,
}));

const dot = {
  hidden: { opacity: 0, scale: 0.4 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

export default function DotGrid() {
  const w = PAD * 2 + (COLS - 1) * GAP;
  const h = PAD * 2 + (ROWS - 1) * GAP;

  return (
    <figure className="space-y-5">
      <motion.svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full max-w-[280px]"
        role="img"
        aria-label="A grid of one hundred dots. Fifty-eight are filled, representing adults with Type 1 diabetes who do not wear a medical ID. Forty-two are gold rings, representing those who do."
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={{
          show: { transition: { staggerChildren: 0.012 } },
        }}
      >
        {CELLS.map((c) => (
          <motion.circle
            key={c.i}
            cx={c.x}
            cy={c.y}
            r={RADIUS}
            variants={dot}
            fill={c.wears ? "none" : "#151513"}
            stroke={c.wears ? "#7a6436" : "none"}
            strokeWidth={c.wears ? 2 : 0}
          />
        ))}
      </motion.svg>

      <figcaption className="flex flex-wrap gap-x-6 gap-y-2 font-sans text-xs text-ash-600">
        <span className="flex items-center gap-2">
          <svg width="14" height="14" aria-hidden="true">
            <circle cx="7" cy="7" r="6" fill="#151513" />
          </svg>
          58 do not wear one
        </span>
        <span className="flex items-center gap-2">
          <svg width="14" height="14" aria-hidden="true">
            <circle
              cx="7"
              cy="7"
              r="5"
              fill="none"
              stroke="#7a6436"
              strokeWidth="2"
            />
          </svg>
          42 do
        </span>
      </figcaption>
    </figure>
  );
}
