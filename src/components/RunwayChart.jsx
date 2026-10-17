import { motion } from "framer-motion";
import { money } from "../data/financials.js";

// Cash on hand across the 24-month plan. One series, so no legend — the title
// names it. The zero crossing is the whole point of the chart, so it gets the
// only accent colour on the page.

const W = 680;
const H = 260;
const PAD = { t: 26, r: 18, b: 34, l: 64 };
const INK = "#151513";
const CORAL = "#d2533a";

export default function RunwayChart({ model }) {
  if (!model.ready) {
    return (
      <div className="border border-dashed border-ash-400/60 bg-bone-50 p-8 font-sans">
        <p className="text-sm font-medium text-ink-900">
          The cash curve cannot be drawn yet.
        </p>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-ash-600">
          Plotting this against missing inputs would produce a flat line at your
          opening balance and imply infinite runway, which is worse than showing
          nothing. Still needed:
        </p>
        <ul className="mt-3 space-y-1">
          {model.gaps.map((g) => (
            <li key={g} className="text-sm text-coral-700">
              — {g}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const pts = model.months;
  const values = pts.map((p) => p.closing).concat([model.cashOnHand, 0]);
  const max = Math.max(...values);
  const min = Math.min(...values, 0);
  const span = max - min || 1;

  const x = (i) => PAD.l + (i / (pts.length - 1)) * (W - PAD.l - PAD.r);
  const y = (v) => PAD.t + (1 - (v - min) / span) * (H - PAD.t - PAD.b);

  const line = pts
    .map((p, i) => `${i ? "L" : "M"} ${x(i)} ${y(p.closing)}`)
    .join(" ");
  const area = `${line} L ${x(pts.length - 1)} ${y(min)} L ${x(0)} ${y(min)} Z`;
  const zeroY = y(0);

  return (
    <figure className="space-y-3">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={`Projected cash over ${pts.length} months, starting at ${money(model.cashOnHand)}${
          model.zeroMonth !== null
            ? ` and reaching zero in month ${model.zeroMonth}`
            : " and staying above zero for the whole plan"
        }.`}
      >
        <defs>
          <linearGradient id="runway-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={INK} stopOpacity="0.14" />
            <stop offset="100%" stopColor={INK} stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Zero line — the only thing that matters on this chart */}
        {min < 0 && (
          <>
            <line
              x1={PAD.l}
              y1={zeroY}
              x2={W - PAD.r}
              y2={zeroY}
              stroke={CORAL}
              strokeWidth="1.25"
              strokeDasharray="4 3"
            />
            <text
              x={PAD.l - 8}
              y={zeroY + 4}
              textAnchor="end"
              className="fill-coral font-sans"
              fontSize="10.5"
            >
              $0
            </text>
          </>
        )}

        <motion.path
          d={area}
          fill="url(#runway-fill)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        />
        <motion.path
          d={line}
          fill="none"
          stroke={INK}
          strokeWidth="2"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* The cliff */}
        {model.zeroMonth !== null && (
          <g>
            <circle cx={x(model.zeroMonth)} cy={y(0)} r="4.5" fill={CORAL} />
            <text
              x={x(model.zeroMonth)}
              y={y(0) - 14}
              textAnchor="middle"
              className="fill-coral font-sans"
              fontSize="11"
              fontWeight="600"
            >
              out of cash · month {model.zeroMonth}
            </text>
          </g>
        )}

        {/* Opening balance, direct-labelled */}
        <text
          x={PAD.l}
          y={PAD.t - 10}
          className="fill-ash-600 font-sans"
          fontSize="10.5"
        >
          {money(model.cashOnHand)} today
        </text>

        {[0, 6, 12, 18, pts.length - 1].map((i) => (
          <text
            key={i}
            x={x(i)}
            y={H - 12}
            textAnchor="middle"
            className="fill-ash-600 font-sans"
            fontSize="10.5"
          >
            M{i}
          </text>
        ))}
      </svg>
      <figcaption className="font-sans text-xs leading-relaxed text-ash-600">
        Closing cash each month, after recurring bills, planned one-off spend
        and any modelled inflows. Built from the inputs in{" "}
        <code className="text-ink-600">src/data/financials.js</code> — change a
        number there and this curve moves.
      </figcaption>
    </figure>
  );
}
