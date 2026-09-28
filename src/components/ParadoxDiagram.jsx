import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import { RotateCcw, Zap } from "lucide-react";

const NODE_W = 148;
const GAP = 35;
const NODE_Y = 74;
const NODE_H = 92;
const MID_Y = NODE_Y + NODE_H / 2;
const LEFT = 10;

const cx = (i) => LEFT + i * (NODE_W + GAP) + NODE_W / 2;
const FIRST = cx(0);
const SECOND = cx(1);
const LAST = cx(4);

// The closed cycle. The pulse runs the row, drops, and comes back to stage two,
// because the purchase is never the failure point.
const RETURN_ARC = `M ${LAST} ${NODE_Y + NODE_H + 8} C ${LAST} 250, ${SECOND} 250, ${SECOND} ${NODE_Y + NODE_H + 12}`;
const LOOP_PATH = `M ${FIRST} ${MID_Y} L ${LAST} ${MID_Y} L ${LAST} ${NODE_Y + NODE_H + 8} C ${LAST} 250, ${SECOND} 250, ${SECOND} ${MID_Y}`;
const OPEN_PATH = `M ${FIRST} ${MID_Y} L ${LAST} ${MID_Y}`;

const LOOP_STAGES = [
  { title: "Diagnosis", a: "a condition a responder", b: "has to know about" },
  { title: "ID acquired", a: "a clinical object,", b: "bought once" },
  { title: "Disclosure", a: "the wrist announces", b: "the diagnosis" },
  { title: "Social cost", a: "paid daily,", b: "in the present" },
  { title: "Non-wear", a: "the information is", b: "absent on the day" },
];

const OPEN_STAGES = [
  { title: "Diagnosis", a: "a condition a responder", b: "has to know about" },
  { title: "Band chosen", a: "picked the way an", b: "accessory is picked" },
  { title: "No disclosure", a: "reads as jewelry,", b: "not as equipment" },
  { title: "Nothing to pay", a: "no cost lands", b: "in the present" },
  { title: "Worn", a: "the information is", b: "there on the day" },
];

export default function ParadoxDiagram() {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const stages = open ? OPEN_STAGES : LOOP_STAGES;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-sans text-xs tracking-widest text-ash-600 uppercase">
          {open ? "The loop, opened" : "The loop, as it runs today"}
        </p>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-pressed={open}
          className="inline-flex items-center gap-2 border border-gold-600/50 bg-bone-100 px-3 py-1.5 font-sans text-xs tracking-wide text-ink-700 transition-colors hover:bg-bone-200"
        >
          {open ? <RotateCcw size={13} /> : <Zap size={13} />}
          {open ? "Show the loop again" : "Apply the intervention"}
        </button>
      </div>

      <svg
        viewBox="0 0 900 300"
        className="h-auto w-full"
        role="img"
        aria-label={
          open
            ? "The same five stages with the intervention applied. The band is chosen rather than issued, so it discloses nothing, no daily cost lands, and the chain ends at worn. The return arrow is gone: the cycle no longer closes."
            : "A five stage cycle. Diagnosis leads to acquiring a clinical medical ID, which discloses the diagnosis publicly, which imposes a daily social cost, which leads to non-wear. An arrow returns from non-wear to the acquisition stage, closing the loop."
        }
      >
        <defs>
          <marker
            id="pd-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#9a9486" />
          </marker>
          <marker
            id="pd-arrow-gold"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#c6a15b" />
          </marker>
          <radialGradient id="pd-pulse">
            <stop offset="0%" stopColor="#c6a15b" stopOpacity="1" />
            <stop offset="100%" stopColor="#c6a15b" stopOpacity="0" />
          </radialGradient>
          <path id="pd-loop-path" d={LOOP_PATH} />
          <path id="pd-open-path" d={OPEN_PATH} />
        </defs>

        {/* Where the intervention enters */}
        <text
          x={cx(2)}
          y="26"
          textAnchor="middle"
          className="fill-gold-800 font-sans"
          fontSize="11"
          letterSpacing="1.4"
        >
          DESIGN INTERVENTION
        </text>
        <text
          x={cx(2)}
          y="44"
          textAnchor="middle"
          className="fill-gold-800/75 font-sans"
          fontSize="10.5"
        >
          {open
            ? "the signal is gone, the payload remains"
            : "remove the signal, keep the payload"}
        </text>
        <line
          x1={cx(2)}
          y1="52"
          x2={cx(2)}
          y2={NODE_Y - 6}
          stroke="#c6a15b"
          strokeWidth="1.25"
          markerEnd="url(#pd-arrow-gold)"
        />

        {stages.map((stage, i) => {
          const x = LEFT + i * (NODE_W + GAP);
          const lit = open ? i >= 2 : i === 2;
          return (
            <g key={stage.title}>
              <rect
                x={x}
                y={NODE_Y}
                width={NODE_W}
                height={NODE_H}
                rx="4"
                fill={lit ? "#faf3e2" : "#ffffff"}
                stroke={lit ? "#c6a15b" : "#ede6d6"}
                strokeWidth="1"
              />
              <text
                x={x + 14}
                y={NODE_Y + 24}
                className="fill-ash-600 font-sans"
                fontSize="9.5"
                letterSpacing="1.2"
              >
                {String(i + 1).padStart(2, "0")}
              </text>
              <text
                x={x + 14}
                y={NODE_Y + 47}
                className="fill-ink-900 font-sans"
                fontSize="14"
                fontWeight="600"
              >
                {stage.title}
              </text>
              <text
                x={x + 14}
                y={NODE_Y + 66}
                className="fill-ash-600 font-sans"
                fontSize="10.5"
              >
                {stage.a}
              </text>
              <text
                x={x + 14}
                y={NODE_Y + 80}
                className="fill-ash-600 font-sans"
                fontSize="10.5"
              >
                {stage.b}
              </text>

              {i < stages.length - 1 && (
                <line
                  x1={x + NODE_W + 7}
                  y1={MID_Y}
                  x2={x + NODE_W + GAP - 7}
                  y2={MID_Y}
                  stroke={open && i >= 1 ? "#c6a15b" : "#9a9486"}
                  strokeWidth="1.25"
                  markerEnd={`url(#pd-arrow${open && i >= 1 ? "-gold" : ""})`}
                />
              )}
            </g>
          );
        })}

        {/* The closing arc exists only while the loop is closed. */}
        {!open && (
          <path
            d={RETURN_ARC}
            fill="none"
            stroke="#9a9486"
            strokeWidth="1.25"
            strokeDasharray="4 4"
            markerEnd="url(#pd-arrow)"
          />
        )}

        {/* The travelling pulse. Loops forever while the cycle is closed; runs once
            and stops at "Worn" when it is open. Suppressed under reduced motion. */}
        {!reduced && (
          <circle key={open ? "open" : "loop"} r="9" fill="url(#pd-pulse)">
            <animateMotion
              dur={open ? "2.2s" : "6s"}
              repeatCount={open ? "1" : "indefinite"}
              fill="freeze"
              rotate="auto"
            >
              <mpath href={open ? "#pd-open-path" : "#pd-loop-path"} />
            </animateMotion>
          </circle>
        )}

        <text
          x="450"
          y="272"
          textAnchor="middle"
          className="fill-ash-600 font-sans"
          fontSize="11"
        >
          {open
            ? "Nothing here asks the wearer to try harder. One stage changed, and the chain stopped returning."
            : "The purchase is never the failure point. The loop closes at the wrist, every morning."}
        </text>
      </svg>
    </div>
  );
}
