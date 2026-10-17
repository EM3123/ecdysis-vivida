import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, FlaskConical, ShoppingBag } from "lucide-react";
import Band from "../components/Band.jsx";
import { ScaleField } from "../components/SnakeSkin.jsx";
import { SPECIES } from "../components/species.js";

// The 10-second page.
//
// Nielsen, on Liu/White/Dumais's Weibull analysis of 2bn+ dwell times: the first
// 10 seconds are ruthless triage, and you only earn the next 30 — and through
// them, several minutes — by landing the value proposition inside that window.
// So this page carries one claim, one number, the object, and a fork. It does
// not scroll on a laptop, and it does not explain. Explaining is the next page's
// job, and the next page has a far more generous budget.

const DOORS = [
  {
    to: "/consumer",
    icon: ShoppingBag,
    label: "I'd wear one",
    line: "The object, the five species, and the waitlist for the first drop.",
  },
  {
    to: "/research",
    icon: FlaskConical,
    label: "Show me the research",
    line: "The adherence paradox, the behavioral mechanisms, and the sources.",
  },
];

export default function Landing() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-bone-50 font-serif text-ink-800 selection:bg-gold-600/30">
      <ScaleField
        id="skin-landing"
        color="#9a9486"
        opacity={0.18}
        scale={1.35}
      />

      <div className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-16">
        <div className="grid items-center gap-12 md:grid-cols-[1.25fr_auto]">
          <div className="space-y-7">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 font-sans"
            >
              <span className="text-sm font-semibold tracking-widest uppercase">
                Ecdysis
              </span>
              <span className="text-gold-800">/</span>
              <span className="text-sm tracking-wide text-ash-600">Vivida</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl leading-[1.08] font-light tracking-tight text-ink-900 sm:text-5xl md:text-6xl"
            >
              A medical ID people
              <br />
              <span className="text-gold-800">actually want to wear.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="max-w-lg text-lg leading-relaxed text-ash-600"
            >
              <strong className="font-normal text-ink-900">
                58% of adults with Type 1 diabetes don't wear one.
              </strong>{" "}
              Not because they can't afford it. Because it looks like medical
              equipment, and it announces a diagnosis to every room they walk
              into. We rebuilt the object so that stops being true.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col gap-3 pt-2 font-sans sm:flex-row"
            >
              {DOORS.map((d) => (
                <Link
                  key={d.to}
                  to={d.to}
                  className="group flex-1 border border-bone-200 bg-white/70 p-5 transition-colors hover:border-gold-600 hover:bg-white"
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-ink-900">
                    <d.icon size={16} className="text-gold-800" />
                    {d.label}
                    <ArrowRight
                      size={14}
                      className="text-ash-600 transition-transform group-hover:translate-x-1"
                    />
                  </span>
                  <span className="mt-2 block text-xs leading-relaxed text-ash-600">
                    {d.line}
                  </span>
                </Link>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-44 sm:w-56 md:w-64"
          >
            <Band species={SPECIES[0]} />
          </motion.div>
        </div>
      </div>

      <footer className="relative px-6 pb-8 text-center font-sans">
        <p className="mx-auto max-w-xl text-[10px] leading-relaxed text-ash-600">
          Vivida stores user-entered emergency information on the band and makes
          it available by NFC or QR. It does not diagnose, treat, monitor or
          transmit anything, and makes no FDA clearance claim.
        </p>
      </footer>
    </main>
  );
}
