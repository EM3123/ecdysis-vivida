import { motion } from "framer-motion";

// A schematic, not a dataset. It carries no units because there are none to carry:
// the claim is the shape, which is why both series are direct-labeled and there is
// no y axis to read values off.

const BASE = 214;
const LEFT = 58;
const RIGHT = 600;
const DAYS = 29;
const STEP = (RIGHT - LEFT) / (DAYS - 1);

const COST_H = 34; // the daily social cost, constant and recurring
const EVENT_X = LEFT + 20 * STEP;
const EVENT_H = 152; // the emergency, when it finally arrives
const DISCOUNTED_H = 9; // the same event, valued from this morning

const COST = "#d2533a";
const INK = "#151513";

const bar = {
  hidden: { scaleY: 0 },
  show: { scaleY: 1, transition: { duration: 0.35 } },
};

export default function PresentBiasChart() {
  return (
    <figure className="space-y-4">
      <motion.svg
        viewBox="0 0 640 268"
        className="w-full"
        role="img"
        aria-label="A schematic comparing two quantities over time. A small social cost repeats every single day from today onward. A single large benefit arrives once, on one unplanned future day. Valued from today, that benefit shrinks to almost nothing, which is why the repeating daily cost wins."
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={{ show: { transition: { staggerChildren: 0.03 } } }}
      >
        {/* Baseline */}
        <line
          x1={LEFT - 14}
          y1={BASE}
          x2={RIGHT + 24}
          y2={BASE}
          stroke="#ede6d6"
          strokeWidth="1.5"
        />

        {/* The cost, paid every morning */}
        {Array.from({ length: DAYS }, (_, i) => (
          <motion.rect
            key={i}
            x={LEFT + i * STEP - 3.5}
            y={BASE - COST_H}
            width="7"
            height={COST_H}
            rx="3"
            fill={COST}
            variants={bar}
            style={{ transformOrigin: `${LEFT + i * STEP}px ${BASE}px` }}
          />
        ))}

        {/* The emergency: one unplanned day */}
        <motion.rect
          x={EVENT_X - 5}
          y={BASE - EVENT_H}
          width="10"
          height={EVENT_H}
          rx="4"
          fill={INK}
          variants={{
            hidden: { scaleY: 0 },
            show: { scaleY: 1, transition: { duration: 0.6, delay: 0.5 } },
          }}
          style={{ transformOrigin: `${EVENT_X}px ${BASE}px` }}
        />

        {/* The same event, discounted to this morning */}
        <motion.rect
          x={EVENT_X + 22}
          y={BASE - DISCOUNTED_H}
          width="10"
          height={DISCOUNTED_H}
          rx="3"
          fill="none"
          stroke={INK}
          strokeWidth="1.5"
          strokeDasharray="3 2"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { duration: 0.4, delay: 1.25 } },
          }}
        />

        {/* The discounting itself, drawn as the collapse from event to felt value */}
        <motion.path
          d={`M ${EVENT_X + 8} ${BASE - EVENT_H + 6} C ${EVENT_X + 52} ${BASE - EVENT_H + 10}, ${EVENT_X + 52} ${BASE - 46}, ${EVENT_X + 31} ${BASE - DISCOUNTED_H - 9}`}
          fill="none"
          stroke="#9a9486"
          strokeWidth="1.25"
          strokeDasharray="4 3"
          markerEnd="url(#pb-arrow)"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            show: {
              pathLength: 1,
              opacity: 1,
              transition: { duration: 0.7, delay: 1.35 },
            },
          }}
        />
        <defs>
          <marker
            id="pb-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#9a9486" />
          </marker>
        </defs>

        {/* Direct labels: identity never rests on colour alone */}
        <text
          x={LEFT - 2}
          y={BASE - COST_H - 30}
          className="fill-ink-900 font-sans"
          fontSize="12.5"
          fontWeight="600"
        >
          The social cost
        </text>
        <text
          x={LEFT - 2}
          y={BASE - COST_H - 16}
          className="fill-ash-600 font-sans"
          fontSize="11"
        >
          paid every single morning
        </text>

        <text
          x={EVENT_X - 5}
          y={BASE - EVENT_H - 22}
          className="fill-ink-900 font-sans"
          fontSize="12.5"
          fontWeight="600"
        >
          The emergency
        </text>
        <text
          x={EVENT_X - 5}
          y={BASE - EVENT_H - 8}
          className="fill-ash-600 font-sans"
          fontSize="11"
        >
          one unplanned day
        </text>

        <text
          x={EVENT_X + 50}
          y={BASE - 86}
          className="fill-ash-600 font-sans"
          fontSize="11"
        >
          the same benefit,
        </text>
        <text
          x={EVENT_X + 50}
          y={BASE - 73}
          className="fill-ash-600 font-sans"
          fontSize="11"
        >
          valued from today
        </text>

        <text
          x={LEFT - 14}
          y={BASE + 20}
          className="fill-ash-600 font-sans"
          fontSize="11"
        >
          today
        </text>
        <text
          x={RIGHT + 24}
          y={BASE + 20}
          textAnchor="end"
          className="fill-ash-600 font-sans"
          fontSize="11"
        >
          an unplanned future day
        </text>
      </motion.svg>

      <figcaption className="font-sans text-xs leading-relaxed text-ash-600">
        Schematic, with no units on either axis. The shape is the claim: a small
        cost that recurs every morning outweighs a large benefit that arrives
        once, because the benefit is discounted to almost nothing by the time
        the wearer is standing at the dresser.
        <span className="text-ink-600">
          {" "}
          The wearer is not being irrational. They are being ordinary.
        </span>
      </figcaption>
    </figure>
  );
}
