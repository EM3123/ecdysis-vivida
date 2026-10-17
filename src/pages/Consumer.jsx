import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Nfc, QrCode, ShieldCheck, Zap } from "lucide-react";
import Band from "../components/Band.jsx";
import SiteNav from "../components/SiteNav.jsx";
import { ScaleField } from "../components/SnakeSkin.jsx";
import { SPECIES } from "../components/species.js";
import { WAITLIST_ENDPOINT, isWaitlistLive } from "../data/waitlist.js";
import { VIEWPORT, item, reveal, stagger } from "../components/motion.js";

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

const FACTS = [
  {
    icon: Zap,
    title: "Nothing to charge",
    body: "No battery, no app, no account, no signal. The tag draws power from the phone that reads it, so it works in a basement with no bars and a dead phone of your own.",
  },
  {
    icon: Nfc,
    title: "A tap reads it",
    body: "A responder holds their phone to the band and your emergency information opens. No app for them to install at the worst possible moment.",
  },
  {
    icon: QrCode,
    title: "A camera reads it too",
    body: "There's a QR code on the inside face, deliberately large. If the tap doesn't work on their handset, any camera resolves it.",
  },
  {
    icon: ShieldCheck,
    title: "It stays on the band",
    body: "Your information is written to the band itself, not to our server. There's no account to breach and nothing of yours for us to sell.",
  },
];

export default function Consumer() {
  const [colorway, setColorway] = useState(SPECIES[0].key);
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle");
  const species = SPECIES.find((s) => s.key === colorway) ?? SPECIES[0];
  const live = isWaitlistLive();

  const submit = async (e) => {
    e.preventDefault();
    if (!live || state === "sending") return;
    setState("sending");
    try {
      const res = await fetch(WAITLIST_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          species: species.name,
          source: "consumer-page",
        }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  };

  return (
    <div className="min-h-screen bg-bone-50 font-serif text-ink-800 selection:bg-gold-600/30">
      <SiteNav />

      <section className="relative overflow-hidden px-6 pt-32 pb-20">
        <ScaleField
          id="skin-consumer"
          color="#9a9486"
          opacity={0.18}
          scale={1.35}
        />
        <div className="relative mx-auto grid max-w-4xl items-center gap-12 md:grid-cols-[1fr_auto]">
          <div className="space-y-6">
            <h1 className="text-4xl leading-[1.1] font-light tracking-tight text-ink-900 md:text-5xl">
              Wear it because you
              <br />
              <span className="text-gold-800">like how it looks.</span>
            </h1>
            <p className="max-w-lg text-lg leading-relaxed text-ash-600">
              The life-saving part is the part you forget about. A stainless
              armature bends to your wrist and holds. Matte silicone, snakeskin
              texture, one line of brushed gold. It reads as jewelry to everyone
              except the person who needs to read it.
            </p>
          </div>
          <motion.div
            key={species.key}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-48 md:w-60"
          >
            <Band species={species} />
          </motion.div>
        </div>
      </section>

      <section className="border-y border-bone-200 bg-white px-6 py-20">
        <div className="mx-auto max-w-4xl space-y-10">
          <Reveal>
            <h2 className="text-3xl leading-snug font-light text-ink-900">
              Five species. Pick yours.
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-ash-600">
              Each colorway is a release, not a stock option on a shelf. Black
              Mamba leads, Coral Snake is numbered and limited.
            </p>
          </Reveal>

          <Reveal>
            <div className="flex flex-wrap gap-4 font-sans">
              {SPECIES.map((s) => {
                const on = s.key === colorway;
                return (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setColorway(s.key)}
                    aria-pressed={on}
                    className={`flex items-center gap-3 border px-4 py-3 text-sm transition-colors ${
                      on
                        ? "border-gold-600 bg-bone-50 font-medium text-ink-900"
                        : "border-bone-200 text-ash-600 hover:border-ash-400 hover:text-ink-800"
                    }`}
                  >
                    <span
                      className="h-5 w-5 rounded-full border border-bone-200"
                      style={{ backgroundColor: s.color }}
                    />
                    {s.name}
                    {s.accent && (
                      <span className="text-[10px] tracking-widest text-gold-800 uppercase">
                        {s.tag}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </Reveal>

          <Reveal>
            <p className="max-w-xl leading-relaxed text-ash-600">
              {species.note}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl space-y-10">
          <Reveal>
            <h2 className="text-3xl leading-snug font-light text-ink-900">
              How a stranger gets your information.
            </h2>
          </Reveal>
          <motion.div
            variants={stagger(0.08)}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="grid gap-8 font-sans sm:grid-cols-2"
          >
            {FACTS.map((f) => (
              <motion.div key={f.title} variants={item} className="space-y-3">
                <f.icon className="text-gold-800" size={22} />
                <h3 className="font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-ash-600">{f.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* The waitlist. Its conversion rate is the evidence the venture is missing. */}
      <section className="relative overflow-hidden bg-ink-800 px-6 py-24 text-bone-100">
        <ScaleField
          id="skin-waitlist"
          color="#c6a15b"
          opacity={0.13}
          scale={1.45}
        />
        <div className="relative mx-auto max-w-2xl space-y-7 text-center">
          <h2 className="text-3xl leading-snug font-light text-white md:text-4xl">
            Be told when Black Mamba drops.
          </h2>
          <p className="leading-relaxed text-bone-100/70">
            Nothing to buy yet. We're building the first production run, and the
            people on this list hear first — and tell us which species to make
            more of.
          </p>

          {state === "done" ? (
            <p className="inline-flex items-center gap-2 border border-gold-600/40 bg-black/30 px-5 py-3 font-sans text-sm text-gold-600">
              <Check size={16} /> You're on the list for {species.name}.
            </p>
          ) : (
            <form
              onSubmit={submit}
              className="mx-auto flex max-w-md flex-col gap-3 font-sans sm:flex-row"
            >
              <label className="sr-only" htmlFor="waitlist-email">
                Email address
              </label>
              <input
                id="waitlist-email"
                type="email"
                required
                disabled={!live || state === "sending"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 border border-white/15 bg-black/30 px-4 py-3 text-sm text-bone-100 placeholder:text-bone-100/35 focus:border-gold-600 focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!live || state === "sending"}
                className="bg-gold-600 px-5 py-3 text-sm font-medium text-ink-900 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {state === "sending" ? "Adding…" : "Join the list"}
              </button>
            </form>
          )}

          {!live && (
            <p className="font-sans text-xs text-bone-100/50">
              Signups open shortly.
            </p>
          )}
          {state === "error" && (
            <p className="font-sans text-xs text-coral">
              That didn't go through. Try again in a moment.
            </p>
          )}
        </div>
      </section>

      <footer className="bg-ink-900 px-6 py-12 text-center font-sans">
        <p className="text-xs tracking-widest text-gold-600 uppercase">
          Ecdysis / Vivida
        </p>
        <p className="mx-auto mt-4 max-w-lg text-[10px] leading-relaxed text-ash-400">
          Vivida is a durable wearable that stores user-entered emergency
          information locally and makes it available through NFC or QR. It is a
          passive consumer information carrier. It does not diagnose, treat,
          monitor or manage any medical condition, it transmits nothing, and it
          makes no FDA clearance claim. Formal regulatory review comes before
          commercialization.
        </p>
      </footer>
    </div>
  );
}
