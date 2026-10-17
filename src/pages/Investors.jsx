import { motion } from "framer-motion";
import { AlertTriangle, EyeOff } from "lucide-react";
import RunwayChart from "../components/RunwayChart.jsx";
import SiteNav from "../components/SiteNav.jsx";
import { VIEWPORT, item, reveal, stagger } from "../components/motion.js";
import { FINANCIALS, buildModel, money } from "../data/financials.js";

const Reveal = ({ children, className = "" }) => (
  <motion.div
    className={className}
    variants={reveal}
    initial="hidden"
    whileInView="show"
    viewport={VIEWPORT}
  >
    {children}
  </motion.div>
);

/** A figure that has not been supplied. Never renders a zero in its place. */
const Pending = ({ what = "not yet supplied" }) => (
  <span className="inline-block bg-coral/10 px-2 py-0.5 font-sans text-[11px] tracking-widest text-coral-700 uppercase">
    {what}
  </span>
);

const Stat = ({ label, value, sub }) => (
  <div className="space-y-2 border border-bone-200 bg-white p-6">
    <span className="block font-sans text-xs tracking-widest text-ash-600 uppercase">
      {label}
    </span>
    <div className="text-3xl font-light tracking-tight text-ink-900">
      {value ?? <Pending />}
    </div>
    {sub && (
      <p className="font-sans text-xs leading-relaxed text-ash-600">{sub}</p>
    )}
  </div>
);

// From the deck's validation slide. These are real and already true.
const LADDER = [
  { label: "Locked v1 product spec and tech pack", have: true },
  { label: "Armature wire working and holding its bend", have: true },
  { label: "Concept renders and brand architecture", have: true },
  { label: "Warm path to emergency medicine leadership, UC Davis", have: true },
  { label: "25–35 discovery interviews", have: false },
  { label: "7–14 day wear test, 10 participants", have: false },
  { label: "Waitlist conversion from strangers", have: false },
  { label: "Refundable deposits", have: false },
  { label: "NFC read filmed on current iPhone and Android", have: false },
  { label: "Responder recognition and time-to-information", have: false },
];

export default function Investors() {
  const model = buildModel(FINANCIALS, 24);
  const f = FINANCIALS;

  const runway =
    model.ready && Number.isFinite(model.runwayMonths)
      ? `${model.runwayMonths.toFixed(1)} months`
      : null;

  return (
    <div className="min-h-screen bg-bone-50 font-serif text-ink-800 selection:bg-gold-600/30">
      <SiteNav
        right={
          <span className="flex items-center gap-1.5 font-sans text-[10px] tracking-widest text-ash-600 uppercase">
            <EyeOff size={12} /> Unlisted
          </span>
        }
      />

      <section className="px-6 pt-32 pb-16">
        <div className="mx-auto max-w-4xl space-y-6">
          <span className="font-sans text-sm tracking-widest text-ash-600 uppercase">
            Investor brief
          </span>
          <h1 className="max-w-3xl text-4xl leading-[1.1] font-light tracking-tight text-ink-900 md:text-5xl">
            A behavioral-adherence company in a category that has never shipped
            desirability.
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-ash-600">
            MedicAlert was founded in 1956 and still sells the read as a yearly
            plan. The engraved bracelet works and goes unworn. We think
            adherence is a design problem, and we are building the evidence to
            prove or kill that claim.
          </p>
        </div>
      </section>

      {/* The honesty banner. This page is a frame, not a filing. */}
      <section className="px-6 pb-14">
        <div className="mx-auto max-w-4xl">
          <div className="flex gap-4 border border-coral/40 bg-coral/5 p-6 font-sans">
            <AlertTriangle
              className="mt-0.5 shrink-0 text-coral-700"
              size={18}
            />
            <div className="space-y-2">
              <p className="text-sm font-medium text-ink-900">
                The financial figures on this page are not yet filled in.
              </p>
              <p className="max-w-2xl text-sm leading-relaxed text-ash-600">
                The model below is real and the arithmetic runs, but every input
                is blank until actual numbers are supplied. Nothing here is
                estimated from a comparable company or inferred from the deck.
                Where a figure is missing you will see a marker, not a zero.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-bone-200 bg-white px-6 py-20">
        <div className="mx-auto max-w-4xl space-y-10">
          <Reveal>
            <h2 className="font-sans text-sm tracking-widest text-ash-600 uppercase">
              Position
            </h2>
          </Reveal>
          <motion.div
            variants={stagger(0.07)}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            <motion.div variants={item}>
              <Stat
                label="Cash on hand"
                value={money(f.cashOnHand)}
                sub={f.asOf ? `As of ${f.asOf}` : "Date not supplied"}
              />
            </motion.div>
            <motion.div variants={item}>
              <Stat
                label="Monthly burn"
                value={money(model.monthlyBurn)}
                sub="Recurring bills only, before one-off project spend"
              />
            </motion.div>
            <motion.div variants={item}>
              <Stat
                label="Runway"
                value={runway}
                sub="Cash divided by recurring burn"
              />
            </motion.div>
            <motion.div variants={item}>
              <Stat
                label="Landed COGS"
                value={money(f.unitEconomics.landedCogs)}
                sub="Needs two supplier quotes. The deck flags the 60% margin target as unbacked."
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl space-y-10">
          <Reveal>
            <h2 className="font-sans text-sm tracking-widest text-ash-600 uppercase">
              24-month rolling plan
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ash-600">
              Cash, month by month, across the three stages the roadmap already
              names: prove the mold and the read, run the pilot, then launch.
            </p>
          </Reveal>
          <Reveal>
            <RunwayChart model={model} />
          </Reveal>
        </div>
      </section>

      <section className="border-y border-bone-200 bg-white px-6 py-20">
        <div className="mx-auto max-w-4xl space-y-10">
          <Reveal>
            <h2 className="font-sans text-sm tracking-widest text-ash-600 uppercase">
              The bills
            </h2>
          </Reveal>
          <Reveal>
            <table className="w-full font-sans text-sm">
              <caption className="sr-only">Recurring monthly costs</caption>
              <thead>
                <tr className="border-b border-bone-200 text-left">
                  <th scope="col" className="py-3 font-medium text-ash-600">
                    Line
                  </th>
                  <th
                    scope="col"
                    className="py-3 text-right font-medium text-ash-600"
                  >
                    Monthly
                  </th>
                </tr>
              </thead>
              <tbody>
                {f.monthlyBills.map((b) => (
                  <tr key={b.key} className="border-b border-bone-200/70">
                    <td className="py-3 text-ink-700">
                      {b.label}
                      {b.note && (
                        <span className="block text-xs text-ash-600">
                          {b.note}
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      {money(b.amount) ?? <Pending what="—" />}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="py-3 font-medium text-ink-900">
                    Total monthly burn
                  </td>
                  <td className="py-3 text-right font-medium text-ink-900">
                    {money(model.monthlyBurn) ?? <Pending />}
                  </td>
                </tr>
              </tbody>
            </table>
          </Reveal>

          <Reveal>
            <h3 className="font-sans text-sm tracking-widest text-ash-600 uppercase">
              Planned one-off spend
            </h3>
            <ul className="mt-5 space-y-3 font-sans text-sm">
              {f.plannedSpend.map((p) => (
                <li
                  key={p.label}
                  className="flex items-baseline justify-between gap-6 border-b border-bone-200/70 pb-3"
                >
                  <span className="text-ink-700">
                    <span className="mr-2 text-[10px] tracking-widest text-gold-800 uppercase">
                      {p.stage}
                    </span>
                    {p.label}
                  </span>
                  <span className="shrink-0 text-ash-600">
                    {money(p.amount) ?? <Pending what="—" />}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl space-y-10">
          <Reveal>
            <h2 className="font-sans text-sm tracking-widest text-ash-600 uppercase">
              Evidence ladder
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ash-600">
              What is true today, and what Round 1 has to show. The gap is
              demand evidence, and we would rather name it than dress it.
            </p>
          </Reveal>
          <motion.ul
            variants={stagger(0.05)}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="grid gap-x-10 gap-y-3 font-sans text-sm sm:grid-cols-2"
          >
            {LADDER.map((l) => (
              <motion.li key={l.label} variants={item} className="flex gap-3">
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                    l.have ? "bg-gold-600" : "border border-ash-400"
                  }`}
                />
                <span className={l.have ? "text-ink-700" : "text-ash-600"}>
                  {l.label}
                  {!l.have && (
                    <span className="ml-2 text-[10px] tracking-widest text-ash-600 uppercase">
                      not yet
                    </span>
                  )}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      <footer className="bg-ink-900 px-6 py-12 text-center font-sans">
        <p className="text-xs tracking-widest text-gold-600 uppercase">
          Ecdysis / Vivida — Investor brief
        </p>
        <p className="mx-auto mt-4 max-w-lg text-[10px] leading-relaxed text-ash-400">
          This page is shared by link and is not indexed. Figures are management
          estimates for discussion, not audited accounts, and are incomplete
          where marked. Vivida is a passive consumer information carrier; it
          does not diagnose, treat or monitor any condition and makes no FDA
          clearance claim.
        </p>
      </footer>
    </div>
  );
}
