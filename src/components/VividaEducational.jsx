import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MotionConfig, motion, useScroll, useTransform } from "framer-motion";
import {
  Activity,
  Brain,
  EyeOff,
  Fingerprint,
  Nfc,
  QrCode,
  ShieldAlert,
  Sparkles,
  TriangleAlert,
  Users,
} from "lucide-react";
import Band from "./Band.jsx";
import ContentsMenu from "./ContentsMenu.jsx";
import DotGrid from "./DotGrid.jsx";
import ParadoxDiagram from "./ParadoxDiagram.jsx";
import PresentBiasChart from "./PresentBiasChart.jsx";
import ScrollProgress from "./ScrollProgress.jsx";
import SectionRail from "./SectionRail.jsx";
import { ScaleField, ScaleRule } from "./SnakeSkin.jsx";
import { SECTIONS } from "./sections.js";
import { useActiveSection } from "./useActiveSection.js";
import { SPECIES } from "./species.js";
import { NOTES } from "./notes.js";
import { VIEWPORT, draw, item, reveal, revealSlow, stagger } from "./motion.js";

/** A block arriving on scroll. */
const Reveal = ({ children, variants = reveal, className = "" }) => (
  <motion.div
    className={className}
    variants={variants}
    initial="hidden"
    whileInView="show"
    viewport={VIEWPORT}
  >
    {children}
  </motion.div>
);

/** A list whose children arrive in sequence. */
const Stagger = ({ children, gap = 0.08, delay = 0, className = "", as }) => {
  const Tag = as ? motion[as] : motion.div;
  return (
    <Tag
      className={className}
      variants={stagger(gap, delay)}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
    >
      {children}
    </Tag>
  );
};

// Superscript reference into the Notes section at the foot of the page.
const Ref = ({ n, tone = "light" }) => (
  <a
    href={`#note-${n}`}
    className={`ml-0.5 align-super font-sans text-[0.6em] no-underline hover:underline ${
      tone === "dark" ? "text-gold-600" : "text-gold-800"
    }`}
    aria-label={`See note ${n}`}
  >
    [{n}]
  </a>
);

const SectionLabel = ({ children, tone = "light" }) => (
  <h2
    className={`font-sans text-sm tracking-widest uppercase ${
      tone === "dark" ? "text-gold-600" : "text-ash-600"
    }`}
  >
    {children}
  </h2>
);

const MECHANISMS = {
  cognitive: {
    label: "Present bias",
    icon: Brain,
    finding:
      "A medical ID charges its cost today and pays its benefit on an unscheduled day that may never arrive.",
    mechanism:
      "Intertemporal choice research holds that people discount delayed outcomes steeply, and more steeply still when the outcome is only probable. The wearer accepts a certain, repeated cost this morning against an uncertain benefit at an unknown future date, which is close to the worst possible shape a decision can take.",
    consequence:
      "The decision is not made once at purchase. It is re-made every morning at the dresser, and each morning the immediate cost is vivid while the emergency stays abstract.",
    implication:
      "Drive the present cost below zero. If putting the band on is something the wearer wanted to do anyway, discounting stops binding.",
    ref: 4,
    figure: PresentBiasChart,
  },
  social: {
    label: "The social cost",
    icon: EyeOff,
    finding:
      "A conventional medical ID is a disclosure device worn on the most visible surface of the body.",
    mechanism:
      "The engraved caduceus and the red rod are legible to everyone in the room, not only to responders. Wearing one converts a private diagnosis into a standing public announcement, renewed in every interaction the wearer has that day.",
    consequence:
      "The wearer absorbs a small tax in first impressions, in questions they did not invite, in being read as a patient before being read as a person.",
    implication:
      "Decouple legibility from visibility. The payload stays fully accessible to a responder while the object says nothing to a stranger across a table.",
  },
  identity: {
    label: "Identity incongruence",
    icon: Fingerprint,
    finding:
      "Non-wear clusters around identity concerns rather than around price or availability.",
    mechanism:
      "Adherence to a visible medical device depends less on whether the wearer understands the risk than on whether the object fits the person they take themselves to be. The BETTER registry authors also found wearers who felt a continuous glucose monitor already said what needed saying.",
    consequence:
      "Education does not close this gap. Someone who can recite the statistics, and who has already paid for the ID, still leaves it in the drawer.",
    implication:
      "Let the object make a claim about the wearer that the wearer wants made. Adherence then follows from vanity rather than from discipline.",
    ref: 3,
  },
  agency: {
    label: "Split incentives",
    icon: Users,
    finding:
      "A parent pays for the coverage, and a seventeen-year-old decides whether the band ever leaves the dresser.",
    mechanism:
      "In the pediatric allergy and Type 1 segments the buyer and the wearer are different people with different objectives. The buyer optimizes for protection and the wearer optimizes for how the object makes them look, and only the wearer controls the outcome.",
    consequence:
      "The category can post healthy sales while wear rates stay flat, because the transaction closes with someone who is not the one getting dressed.",
    implication:
      "Design for the person who did not pay. A band bought by a parent has to survive the judgment of a teenager before it protects anyone.",
    ref: 6,
  },
};

const TAB_ORDER = Object.keys(MECHANISMS);
const SECTION_IDS = SECTIONS.map((s) => s.id);

const LEVERS = [
  {
    title: "Desirability replaces instruction",
    body: "The category has spent seventy years on education and clinical instruction, both of which address a wearer who already knows the risk. Vivida asks nobody to wear a medical ID. It asks them to pick an accessory, and the medical function rides along on a decision they were making anyway.",
  },
  {
    title: "Choice replaces issue",
    body: "Five species instead of one part number. An object a wearer selected is a different object from one they were issued, because selecting it makes it an expression of taste rather than a consequence of diagnosis. Whether that difference shows up in days worn is exactly what the wear test measures.",
  },
  {
    title: "Scarcity replaces ad spend",
    body: "Releasing colorways as numbered drops gives the band the status mechanics of a watch or a sneaker, and it does the work a marketing budget would otherwise have to buy. This is the same drop cadence our founder ran at CTRL.clo, pointed at a category that has never had a release calendar.",
  },
];

const FALSIFIERS = [
  "Wear rates in a 7 to 14 day diary study come back no higher for the aesthetic band than for a conventional engraved ID. That would mean disclosure was never the binding constraint, and the nudge has nothing to act on.",
  "Responders in timed testing fail to recognize the band as a medical ID, or reach the payload more slowly than they read an engraving. Discretion would then be bought at the cost of the function it exists to protect.",
  "Wearers adopt the band, treat it as jewelry, and stop maintaining the payload, so the record on the wrist goes stale. Adherence to the object would not imply adherence to the data.",
];

export default function VividaEducational() {
  const [activeTab, setActiveTab] = useState("cognitive");
  const [colorway, setColorway] = useState(SPECIES[0].key);
  const heroRef = useRef(null);

  const active = MECHANISMS[activeTab];
  const Figure = active.figure;
  const species = SPECIES.find((s) => s.key === colorway) ?? SPECIES[0];
  const activeSection = useActiveSection(SECTION_IDS);

  // scroll-padding-top on <html> keeps the target clear of the fixed nav, and
  // scroll-behavior is dropped to auto when the reader asks for reduced motion.
  const jumpTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  };

  // The skin drifts as the page moves, at a fraction of the scroll rate.
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const skinY = useTransform(scrollYProgress, [0, 1], [0, 90]);

  const onTabKeyDown = (event) => {
    const step =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next =
      (TAB_ORDER.indexOf(activeTab) + step + TAB_ORDER.length) %
      TAB_ORDER.length;
    setActiveTab(TAB_ORDER[next]);
    document.getElementById(`tab-${TAB_ORDER[next]}`)?.focus();
  };

  const onColorwayKeyDown = (event) => {
    const step =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const idx = SPECIES.findIndex((s) => s.key === colorway);
    const next = (idx + step + SPECIES.length) % SPECIES.length;
    setColorway(SPECIES[next].key);
    document.getElementById(`colorway-${SPECIES[next].key}`)?.focus();
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-bone-50 font-serif text-ink-800 selection:bg-gold-600/30">
        <ScrollProgress />
        <SectionRail active={activeSection} onJump={jumpTo} />
        <nav className="fixed top-0 z-50 w-full border-b border-bone-200 bg-bone-50/85 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6 font-sans">
            <Link to="/" className="flex items-center gap-3">
              <span className="text-sm font-semibold tracking-widest uppercase">
                Ecdysis
              </span>
              <span className="text-gold-800">/</span>
              <span className="text-sm tracking-wide text-ash-600">
                Research &amp; Design
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                to="/consumer"
                className="text-xs tracking-widest text-ash-600 uppercase transition-colors hover:text-ink-800"
              >
                The band
              </Link>
              <span className="hidden text-xs font-medium tracking-widest text-ash-600 uppercase lg:inline">
                The Adherence Paradox
              </span>
              <ContentsMenu active={activeSection} onJump={jumpTo} />
            </div>
          </div>
        </nav>

        <section
          id="top"
          ref={heroRef}
          className="relative overflow-hidden px-6 pt-40 pb-20"
        >
          <motion.div
            style={{ y: skinY }}
            className="pointer-events-none absolute inset-x-0 -top-20 h-[140%]"
          >
            <ScaleField
              id="skin-hero"
              color="#9a9486"
              opacity={0.2}
              scale={1.35}
            />
          </motion.div>

          <div className="relative mx-auto grid max-w-4xl gap-12 md:grid-cols-[1fr_auto] md:items-center">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="inline-flex items-center gap-2 border border-bone-200 bg-bone-100 px-3 py-1 font-sans text-xs tracking-widest text-ink-600 uppercase"
              >
                <Activity size={14} />
                <span>Case Study</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl leading-[1.1] font-light tracking-tight text-ink-900 md:text-6xl"
              >
                The failure is behavioral.
                <br />
                <span className="text-ash-500">The object is the cause.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="max-w-xl text-xl leading-relaxed text-ash-600"
              >
                Medical IDs are engineered for a singular moment of crisis, yet
                they rely entirely on the daily habit of the wearer. When the
                object itself broadcasts clinical vulnerability, human
                psychology ensures it is left behind. The fix is not a better
                argument. It is a better object.
              </motion.p>

              <motion.div
                variants={draw}
                initial="hidden"
                animate="show"
                transition={{ delay: 0.6 }}
                className="origin-left"
              >
                <ScaleRule id="skin-rule-hero" color="#c6a15b" opacity={0.9} />
              </motion.div>
            </div>

            {/* The object, on the page that is about the object. */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                duration: 1.1,
                delay: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mx-auto w-48 md:w-60"
            >
              <Band species={SPECIES[0]} />
            </motion.div>
          </div>
        </section>

        <section
          id="medical-reality"
          className="border-y border-bone-200 bg-white px-6 py-24"
        >
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <SectionLabel>I. The Medical Reality</SectionLabel>
            </Reveal>

            <div className="mt-12 grid items-start gap-16 md:grid-cols-2">
              <Reveal>
                <div className="space-y-6">
                  <p className="text-3xl leading-snug font-light text-ink-900">
                    Most people who need a medical ID are not wearing one.
                  </p>
                  <p className="text-lg leading-relaxed text-ash-600">
                    Of 2,302 adults with Type 1 diabetes in a 2025 North
                    American registry, 58% said they do not wear one.
                    <Ref n={1} /> Among the young the picture is worse: roughly
                    5% of young Australians with Type 1 held an active
                    subscription, and just 1.8% of those subscribers carried
                    engraved emergency instructions.
                    <Ref n={2} />
                  </p>
                  <div className="border border-bone-200 bg-bone-50 p-6">
                    <ShieldAlert className="mb-3 text-gold-800" size={22} />
                    <h3 className="font-sans text-base font-semibold">
                      The Intervention Gap
                    </h3>
                    <p className="mt-2 font-sans text-sm leading-relaxed text-ash-600">
                      A responder arriving at an unresponsive patient has no way
                      to know whether that patient ever bought an ID. A bare
                      wrist and an unworn wrist are the same wrist. Every dollar
                      the category has earned sits on the wrong side of that
                      gap.
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal>
                <div className="space-y-3">
                  <p className="font-sans text-xs tracking-widest text-ash-600 uppercase">
                    Every 100 adults with Type 1 diabetes
                  </p>
                  <DotGrid />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="paradox" className="px-6 py-24">
          <div className="mx-auto max-w-4xl space-y-12">
            <Reveal>
              <SectionLabel>II. The Paradox, Stated Plainly</SectionLabel>
              <h3 className="mt-8 max-w-2xl text-3xl leading-snug font-light text-ink-900">
                The feature that makes a medical ID useful to a stranger is the
                same feature that makes it unbearable to the wearer.
              </h3>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ash-600">
                An ID has to be recognizable on sight to work in an emergency,
                and recognizable on sight means recognizable to everyone, all
                the time. The category has spent seventy years optimizing the
                four seconds that matter while ignoring the sixteen waking hours
                that decide whether those four seconds ever happen.
              </p>
            </Reveal>

            <Reveal>
              <div className="overflow-x-auto border border-bone-200 bg-white p-6 md:p-10">
                <div className="min-w-[680px]">
                  <ParadoxDiagram />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section
          id="friction"
          className="border-y border-bone-200 bg-white px-6 py-24"
        >
          <div className="mx-auto max-w-4xl space-y-12">
            <Reveal>
              <SectionLabel>III. The Cognitive Friction</SectionLabel>
              <h3 className="mt-8 max-w-2xl text-3xl leading-snug font-light text-ink-900">
                Why do people abandon an object designed to save their lives?
              </h3>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ash-600">
                Four mechanisms compound. Not one of them is ignorance, which is
                why information campaigns have never moved the number.
              </p>
            </Reveal>

            <Reveal>
              <div className="font-sans">
                <div
                  role="tablist"
                  aria-label="Behavioral mechanisms behind medical-ID non-wear"
                  className="flex flex-wrap gap-2 border-b border-bone-200 pb-px"
                  onKeyDown={onTabKeyDown}
                >
                  {TAB_ORDER.map((key) => {
                    const tab = MECHANISMS[key];
                    const isActive = key === activeTab;
                    const TabIcon = tab.icon;
                    return (
                      <button
                        key={key}
                        id={`tab-${key}`}
                        role="tab"
                        type="button"
                        aria-selected={isActive}
                        aria-controls="mechanism-panel"
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => setActiveTab(key)}
                        className={`relative -mb-px flex items-center gap-2 px-4 py-3 text-sm tracking-wide transition-colors ${
                          isActive
                            ? "font-medium text-ink-900"
                            : "text-ash-600 hover:text-ink-800"
                        }`}
                      >
                        <TabIcon size={16} />
                        {tab.label}
                        {isActive && (
                          <motion.span
                            layoutId="tab-underline"
                            className="absolute inset-x-0 -bottom-px h-0.5 bg-gold-600"
                            transition={{
                              type: "spring",
                              stiffness: 420,
                              damping: 34,
                            }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Keyed rather than wrapped in AnimatePresence: a stalled exit
                    animation would otherwise leave the previous panel under a
                    newly selected tab. */}
                <motion.div
                  key={activeTab}
                  id="mechanism-panel"
                  role="tabpanel"
                  aria-labelledby={`tab-${activeTab}`}
                  variants={stagger(0.07)}
                  initial="hidden"
                  animate="show"
                  className="grid gap-8 pt-10 md:grid-cols-[auto_1fr]"
                >
                  <motion.div
                    variants={item}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bone-200 text-ink-700"
                  >
                    <active.icon size={20} />
                  </motion.div>

                  <div className="space-y-8">
                    <motion.p
                      variants={item}
                      className="font-serif text-2xl leading-snug font-light text-ink-900"
                    >
                      {active.finding}
                      {active.ref && <Ref n={active.ref} />}
                    </motion.p>

                    <div className="grid gap-8 text-sm leading-relaxed sm:grid-cols-3">
                      <motion.div variants={item} className="space-y-2">
                        <span className="block text-xs tracking-widest text-ash-600 uppercase">
                          Mechanism
                        </span>
                        <p className="text-ash-600">{active.mechanism}</p>
                      </motion.div>
                      <motion.div variants={item} className="space-y-2">
                        <span className="block text-xs tracking-widest text-ash-600 uppercase">
                          How it shows up
                        </span>
                        <p className="text-ash-600">{active.consequence}</p>
                      </motion.div>
                      <motion.div variants={item} className="space-y-2">
                        <span className="block text-xs tracking-widest text-gold-800 uppercase">
                          Design implication
                        </span>
                        <p className="text-ink-600">{active.implication}</p>
                      </motion.div>
                    </div>

                    {Figure && (
                      <motion.div
                        variants={item}
                        className="border-t border-bone-200 pt-8"
                      >
                        <Figure />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* The centerpiece. Everything before this establishes the failure; this
            is the intervention, and it is a nudge in the strict sense. */}
        <section
          id="nudge"
          className="relative overflow-hidden bg-ink-800 px-6 py-28 text-bone-100"
        >
          <ScaleField
            id="skin-nudge"
            color="#c6a15b"
            opacity={0.13}
            scale={1.45}
          />

          <div className="relative mx-auto max-w-4xl space-y-16">
            <Reveal variants={revealSlow}>
              <SectionLabel tone="dark">IV. The Nudge</SectionLabel>
              <h3 className="mt-8 max-w-3xl text-4xl leading-[1.15] font-light text-white md:text-5xl">
                Desirability is not decoration.
                <br />
                <span className="text-gold-600">It is the intervention.</span>
              </h3>
            </Reveal>

            <div className="grid gap-16 md:grid-cols-[1.1fr_1fr]">
              <Reveal variants={revealSlow}>
                <div className="space-y-6">
                  <Sparkles className="text-gold-600" size={32} />
                  <p className="text-xl leading-relaxed font-light">
                    A nudge changes the choice architecture without forbidding
                    an option or meaningfully changing what anything costs.
                    <Ref n={5} tone="dark" /> That definition is worth holding
                    onto, because it rules out almost everything this category
                    has tried.
                  </p>
                  <p className="font-sans text-sm leading-relaxed text-bone-100/70">
                    Education is not a nudge, it is information aimed at a
                    wearer who already knows the risk. A clinician telling a
                    patient to wear the band is not a nudge either, it is
                    instruction. Neither one touches the variable doing the
                    work, which is what the object means socially on the wrist.
                  </p>
                  <p className="font-sans text-sm leading-relaxed text-bone-100/70">
                    Vivida moves one variable and leaves the rest alone. Nothing
                    is mandated, nothing is subsidized, no option is removed.
                    The band simply becomes something a person would put on for
                    their own reasons, and the emergency payload travels with
                    it.
                  </p>
                </div>
              </Reveal>

              <Stagger
                gap={0.12}
                as="ol"
                className="space-y-8 border-l border-gold-600/30 pl-8 font-sans"
              >
                {LEVERS.map((lever, i) => (
                  <motion.li
                    key={lever.title}
                    variants={item}
                    className="space-y-2"
                  >
                    <span className="block text-xs tracking-widest text-gold-600">
                      LEVER {String(i + 1).padStart(2, "0")}
                    </span>
                    <h4 className="font-medium text-white">{lever.title}</h4>
                    <p className="text-sm leading-relaxed text-bone-100/60">
                      {lever.body}
                    </p>
                  </motion.li>
                ))}
              </Stagger>
            </div>

            <Reveal>
              <div className="border border-white/10 bg-black/30 p-8 font-sans">
                <span className="block text-xs tracking-widest text-gold-600 uppercase">
                  What the nudge is not
                </span>
                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-bone-100/70">
                  There is no app, no streak, no reminder, no notification, and
                  no account. A nudge delivered through a phone would
                  reintroduce the very friction the band exists to remove, and
                  it would fail in exactly the moment it is needed, when the
                  phone is locked or dead. The entire intervention is carried in
                  the object, which is also why the object has to be worth
                  wearing on a day when nothing happens.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <section
          id="species"
          className="border-b border-bone-200 bg-white px-6 py-24"
        >
          <div className="mx-auto max-w-4xl space-y-12">
            <Reveal>
              <SectionLabel>V. Five Species</SectionLabel>
              <h3 className="mt-8 max-w-2xl text-3xl leading-snug font-light text-ink-900">
                The colorways are the mechanism, not the packaging.
              </h3>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ash-600">
                Ecdysis is the shedding of an outer skin so a new one can grow,
                and the band takes its skin literally: matte silicone pressed
                with a snakeskin scale, finished with a single brushed-gold
                line. Each release is a species. Pick one, and notice that
                picking is itself lever two.
              </p>
            </Reveal>

            <Reveal>
              <div className="grid items-center gap-12 border border-bone-200 bg-bone-50 p-8 md:grid-cols-[auto_1fr] md:p-12">
                <motion.div
                  key={species.key}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="mx-auto w-52 md:w-64"
                >
                  <Band species={species} />
                </motion.div>

                <div className="space-y-6 font-sans">
                  <div
                    role="radiogroup"
                    aria-label="Colorway"
                    className="flex flex-wrap gap-3"
                    onKeyDown={onColorwayKeyDown}
                  >
                    {SPECIES.map((s) => {
                      const on = s.key === colorway;
                      return (
                        <button
                          key={s.key}
                          id={`colorway-${s.key}`}
                          type="button"
                          role="radio"
                          aria-checked={on}
                          tabIndex={on ? 0 : -1}
                          onClick={() => setColorway(s.key)}
                          className={`h-9 w-9 rounded-full border transition-transform ${
                            on
                              ? "scale-110 border-gold-600 ring-2 ring-gold-600/35"
                              : "border-bone-200 hover:scale-105"
                          }`}
                          style={{ backgroundColor: s.color }}
                        >
                          <span className="sr-only">{s.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  <motion.div
                    key={species.key}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="space-y-2"
                  >
                    <span
                      className={`block text-[10px] tracking-widest uppercase ${
                        species.accent ? "text-gold-800" : "text-ash-600"
                      }`}
                    >
                      {species.tag}
                    </span>
                    <h4 className="font-serif text-2xl font-light text-ink-900">
                      {species.name}
                    </h4>
                    <p className="max-w-sm text-sm leading-relaxed text-ash-600">
                      {species.note}
                    </p>
                  </motion.div>
                </div>
              </div>
            </Reveal>

            <Stagger className="grid max-w-3xl gap-8 font-sans sm:grid-cols-3">
              <motion.div variants={item} className="space-y-2">
                <span className="block text-xs tracking-widest text-ash-600 uppercase">
                  Armature core
                </span>
                <p className="text-sm leading-relaxed text-ash-600">
                  Stainless wire bends by hand and holds its shape around a
                  wrist, an ankle, a watch strap or the back of a necklace.
                </p>
              </motion.div>
              <motion.div variants={item} className="space-y-2">
                <span className="block text-xs tracking-widest text-ash-600 uppercase">
                  No clasp
                </span>
                <p className="text-sm leading-relaxed text-ash-600">
                  The open, snake-like form has nothing to unlatch, so there is
                  no hinge to fail and nothing to lose.
                </p>
              </motion.div>
              <motion.div variants={item} className="space-y-2">
                <span className="block text-xs tracking-widest text-gold-800 uppercase">
                  Medical ID cue
                </span>
                <p className="text-sm leading-relaxed text-ink-600">
                  A small visible mark tells a responder what the object is
                  before they reach for a phone. The discretion is spent on the
                  diagnosis, never on the category.
                </p>
              </motion.div>
            </Stagger>
          </div>
        </section>

        <section id="read-path" className="px-6 py-24">
          <div className="mx-auto max-w-4xl space-y-12">
            <Reveal>
              <SectionLabel>VI. The Read Path</SectionLabel>
              <h3 className="mt-8 max-w-2xl text-3xl leading-snug font-light text-ink-900">
                An object that hides the diagnosis still has to surrender it in
                four seconds.
              </h3>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ash-600">
                Discretion is only defensible if retrieval is at least as fast
                and as reliable as an engraving. The record lives on the band,
                not on a server, so there is no account to breach and nothing to
                charge.
              </p>
            </Reveal>

            <Stagger gap={0.14} className="grid gap-8 font-sans md:grid-cols-2">
              <motion.div
                variants={item}
                className="h-full space-y-4 border border-bone-200 bg-white p-8"
              >
                <Nfc className="text-gold-800" size={24} />
                <h4 className="text-lg font-semibold">NFC tap, primary</h4>
                <p className="text-sm leading-relaxed text-ash-600">
                  A passive NDEF record on an embedded tag, read on contact with
                  no application installed and no network available. The tag
                  draws power from the reader's phone, so the band still works
                  in a stairwell with no signal. Behavior varies across
                  handsets, which is precisely why it is not the only path.
                  <Ref n={7} />
                </p>
              </motion.div>
              <motion.div
                variants={item}
                className="h-full space-y-4 border border-bone-200 bg-white p-8"
              >
                <QrCode className="text-gold-800" size={24} />
                <h4 className="text-lg font-semibold">Interior QR, fallback</h4>
                <p className="text-sm leading-relaxed text-ash-600">
                  Printed on the inner face and kept deliberately prominent
                  rather than shrunk for the sake of appearance. Any camera
                  resolves it, including on phones where NFC is switched off or
                  unsupported. The inside of the band is unapologetically
                  clinical.
                </p>
              </motion.div>
            </Stagger>
          </div>
        </section>

        <section
          id="falsify"
          className="border-y border-bone-200 bg-white px-6 py-24"
        >
          <div className="mx-auto max-w-4xl space-y-10">
            <Reveal>
              <SectionLabel>VII. What Would Falsify This</SectionLabel>
              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ash-600">
                Everything above is a hypothesis about behavior rather than a
                finding, so it is worth saying what evidence would defeat it. A
                design thesis that cannot fail is not a thesis.
              </p>
            </Reveal>

            <Stagger
              gap={0.1}
              as="ol"
              className="max-w-2xl space-y-6 font-sans"
            >
              {FALSIFIERS.map((text, i) => (
                <motion.li key={i} variants={item} className="flex gap-5">
                  <span className="shrink-0 pt-1.5 text-xs tracking-widest text-gold-800">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm leading-relaxed text-ash-600">{text}</p>
                </motion.li>
              ))}
            </Stagger>

            <Reveal>
              <div className="flex max-w-2xl gap-4 border border-gold-600/40 bg-bone-100 p-6 font-sans">
                <TriangleAlert
                  className="mt-0.5 shrink-0 text-gold-800"
                  size={18}
                />
                <p className="text-sm leading-relaxed text-ink-600">
                  None of these tests has been run yet. This page reads the
                  published literature and states a hypothesis; the wear test,
                  the discovery interviews and the responder evidence are the
                  open gap, and they are the next thing being built.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="notes" className="px-6 py-24">
          <div className="mx-auto max-w-4xl space-y-10">
            <Reveal>
              <SectionLabel>Notes &amp; Sources</SectionLabel>
            </Reveal>
            <Stagger
              gap={0.06}
              as="ol"
              className="max-w-3xl space-y-5 font-sans"
            >
              {NOTES.map((note) => (
                <motion.li
                  key={note.id}
                  variants={item}
                  id={`note-${note.id}`}
                  className="grid grid-cols-[2rem_1fr] gap-3"
                >
                  <span className="pt-1 text-xs text-gold-800">
                    [{note.id}]
                  </span>
                  <div className="space-y-1.5">
                    <p className="text-sm leading-relaxed text-ink-600">
                      {note.claim}
                    </p>
                    <p className="text-xs leading-relaxed text-ash-600">
                      {note.source}
                      {note.status === "pending" && (
                        <span className="ml-2 inline-block bg-coral/10 px-1.5 py-0.5 align-middle text-[10px] tracking-widest text-coral-700 uppercase">
                          citation pending
                        </span>
                      )}
                      {note.status === "internal" && (
                        <span className="ml-2 inline-block bg-bone-200 px-1.5 py-0.5 align-middle text-[10px] tracking-widest text-ash-600 uppercase">
                          internal data
                        </span>
                      )}
                    </p>
                  </div>
                </motion.li>
              ))}
            </Stagger>
          </div>
        </section>

        <footer className="relative overflow-hidden bg-ink-900 px-6 py-14 text-center font-sans">
          <ScaleField
            id="skin-footer"
            color="#c6a15b"
            opacity={0.11}
            scale={1.3}
          />
          <div className="relative space-y-4">
            <p className="font-serif text-2xl font-light text-white">
              We are not asking anyone to choose between safety and
              self-expression.
            </p>
            <p className="text-xs tracking-widest text-gold-600 uppercase">
              Ecdysis Platform / Vivida Research
            </p>
            <p className="mx-auto max-w-lg text-[10px] leading-relaxed text-ash-400">
              Vivida is a durable wearable that stores user-entered emergency
              information locally and makes it available through NFC or QR. It
              is a passive consumer information carrier. It does not diagnose,
              treat, monitor or manage any medical condition, it transmits
              nothing, and it makes no FDA clearance claim. Formal regulatory
              review comes before commercialization.
            </p>
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
}
