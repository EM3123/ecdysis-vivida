import { motion } from "framer-motion";
import { ScalePattern } from "./SnakeSkin.jsx";

// The object itself: an open armature band with no clasp, drawn as a single
// near-closed arc so the gap at the right reads as the snake form.

const CX = 130;
const CY = 130;
const R = 86; // centreline of the band body
const W = 28; // band width
const GOLD_R = R + 8; // the accent line sits just outboard of centre
const OPEN = (26 * Math.PI) / 180; // half-angle of the gap

/** The arc of radius r, traversed the long way round so the gap stays on the right. */
function arc(r) {
  const x = CX + r * Math.cos(OPEN);
  const dy = r * Math.sin(OPEN);
  return `M ${x.toFixed(2)} ${(CY - dy).toFixed(2)} A ${r} ${r} 0 1 0 ${x.toFixed(2)} ${(CY + dy).toFixed(2)}`;
}

const BODY = arc(R);
const ACCENT = arc(GOLD_R);

const channel = (h, i) => parseInt(h.slice(i, i + 2), 16);
/** Mix a hex toward another hex. Used for the sheen, so a flat fill gains a form. */
function mix(hex, toward, amount) {
  const a = [1, 3, 5].map((i) => channel(hex, i));
  const b = [1, 3, 5].map((i) => channel(toward, i));
  return `#${a
    .map((v, i) =>
      Math.round(v + (b[i] - v) * amount)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

export default function Band({ species, className = "", showCue = true }) {
  const { key, color, texture, textureOpacity } = species;
  const light = mix(color, "#ffffff", 0.28);
  const dark = mix(color, "#000000", 0.42);

  return (
    <svg
      viewBox="0 0 260 260"
      className={`h-auto w-full ${className}`}
      role="img"
      aria-label={`The Vivida band in the ${species.name} colorway: an open, clasp-free band with a snakeskin texture and a single brushed-gold accent line.`}
    >
      <defs>
        <linearGradient id={`band-sheen-${key}`} x1="0" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor={light} />
          <stop offset="48%" stopColor={color} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
        <ScalePattern
          id={`band-skin-${key}`}
          color={texture}
          opacity={textureOpacity}
          scale={0.62}
        />
        <filter
          id={`band-shadow-${key}`}
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feDropShadow
            dx="0"
            dy="5"
            stdDeviation="7"
            floodColor="#2e2b25"
            floodOpacity="0.22"
          />
        </filter>
      </defs>

      <g filter={`url(#band-shadow-${key})`}>
        {/* Body. The colour animates so switching colorway reads as the same object. */}
        <motion.path
          d={BODY}
          fill="none"
          stroke={`url(#band-sheen-${key})`}
          strokeWidth={W}
          strokeLinecap="round"
          initial={false}
          animate={{ opacity: 1 }}
        />
        {/* Scale relief, clipped to the body by sharing its stroke geometry. */}
        <path
          d={BODY}
          fill="none"
          stroke={`url(#band-skin-${key})`}
          strokeWidth={W}
          strokeLinecap="round"
        />
        {/* The single brushed-gold line that runs every band. */}
        <path
          d={ACCENT}
          fill="none"
          stroke="#c6a15b"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.95"
        />
      </g>

      {showCue && (
        <g aria-hidden="true">
          {/* The visible MEDICAL ID cue, so a responder reads the object before tapping. */}
          <circle
            cx={CX}
            cy={CY + R}
            r="11"
            fill="#fbf8f1"
            stroke="#c6a15b"
            strokeWidth="1.5"
          />
          <path
            d={`M ${CX - 5} ${CY + R} h 10 M ${CX} ${CY + R - 5} v 10`}
            stroke="#7a6436"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      )}
    </svg>
  );
}
