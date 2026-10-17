# Ecdysis / Vivida

Four routes, built to an attention budget.

| Route | Audience | Job |
| --- | --- | --- |
| `/` | everyone | The 10-second triage page. One claim, one number, the object, a fork. |
| `/consumer` | buyers and wearers | The object, the five species, and the waitlist. |
| `/research` | judges, clinicians | The full case study on adherence. |
| `/investors` | **unlisted** | Burn, runway, the 24-month plan, the evidence ladder. |

## The attention budget

Nielsen (NN/g), built on Liu, White and Dumais's Weibull analysis of over two
billion dwell times across 205,873 pages: the first 10 seconds are ruthless
triage, users stay highly likely to leave through the next 20, and the curve only
flattens around 30 seconds. Survive that and you often get two minutes or more.

So `/` carries one claim and a fork and does not scroll on a laptop. Explaining is
the next page's job, and the next page has a far more generous budget. Do not add
sections to the landing page without taking something else off it.

## The unlisted investor route

`/investors` is not linked from any nav, is disallowed in `public/robots.txt`, and
gets a `noindex,nofollow` meta tag from `RobotsPolicy`, which owns that tag for the
whole app from inside the router. An earlier version created the tag inside the
investor page and removed it on unmount; under StrictMode's mount/cleanup/mount
cycle the stale element reference leaked `noindex` onto `/research` and dropped it
from `/investors`. Reconciling from the live DOM on every location change has one
owner and no race.

**This is obscurity, not security.** Anyone with the link can read the page, and
the `noindex` tag is injected by JavaScript, so it only reaches crawlers that
execute JS. `robots.txt` is the stronger of the two. Do not put anything on this
route that would genuinely harm you if a stranger read it.

## Financial model

`src/data/financials.js` holds every input, and all of them start `null`. Nothing
is estimated, inferred from the deck, or borrowed from a comparable company. The
model returns `ready: false` when it cannot compute honestly, and the page renders
a marker rather than a zero — a chart showing $0 burn and infinite runway is worse
than a chart showing nothing. Fill in the nulls and the curve draws itself.

## Measuring contrast in this codebase

Tailwind v4 emits `oklab()` / `oklch()` colours, and `getComputedStyle` returns
them in that space. A contrast checker that parses the computed string with a
naive `/[\d.]+/g` regex will read `oklab(0.979 0.0005 0.0098 / 0.85)` as a
near-black RGB triple and report wild false failures. Convert through a canvas
instead — set `ctx.fillStyle` to the colour and read the pixel back — which
handles every colour space and alpha exactly.

# The Adherence Paradox

An educational case-study page on the behavioral research behind Vivida, the
medical-ID line of the Ecdysis platform. It argues the adherence problem rather
than pitching the product, and it builds to the nudge: desirability as the
intervention, not as decoration.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run lint
```

## Structure

| Path | What it holds |
| --- | --- |
| `src/components/VividaEducational.jsx` | The page. All copy lives here. |
| `src/components/ParadoxDiagram.jsx` | The five-stage loop, with the pulse and the intervention toggle. |
| `src/components/Band.jsx` | The object itself: open armature form, scale relief, gold line, medical cue. |
| `src/components/DotGrid.jsx` | 100 dots, 58 filled — the BETTER registry non-wear rate. |
| `src/components/PresentBiasChart.jsx` | The discounting schematic. No units; the shape is the claim. |
| `src/components/motion.js` | The motion vocabulary: reveal, stagger, draw. |
| `src/components/sections.js` | The jump-target registry, in document order. |
| `src/components/SectionRail.jsx` | The right-margin jump rail (lg and up). |
| `src/components/ContentsMenu.jsx` | The same jump list, in the nav, below lg. |
| `src/components/ScrollProgress.jsx` | Reading progress, drawn on the nav's bottom edge. |
| `src/components/useActiveSection.js` | Scroll-spy. Passive listener, rAF-coalesced. |
| `src/components/SnakeSkin.jsx` | The scale motif: background field, colorway swatch, section rule. |
| `src/components/species.js` | The five colorway drops and their hex values. |
| `src/components/notes.js` | Every empirical claim, with its citation and status. |

## Palette

Tokens in `src/index.css` are taken from the Vivida pitch deck so the page and
the deck read as one system: brushed gold `#c6a15b`, bone paper `#ede6d6`, warm
near-blacks, and one hex per snake species.

Two tokens need care. `gold-600` is the accent on dark backgrounds only — on
paper it falls to about 2:1, so light backgrounds use `gold-800`. The deck's
warm grey `ash-400` behaves the same way: fine on ink, display-size only on
paper, where labels use `ash-600`. The page currently passes WCAG AA on every
text node at 375px and at desktop width.

## Before this page goes public

`src/components/notes.js` drives the footnotes. Notes 1 through 5 carry the
deck's primary sources. Note 6 (buyer and wearer are different people) is marked
`pending` and renders a red **citation pending** badge until the discovery
interviews back it; note 7 is flagged `internal data` pending stage-2 device
testing. Nothing unsourced can ship silently.

## Navigation and chrome

Reading progress is a 2px bar drawn along the **bottom edge of the fixed nav**, so
it doubles as that bar's border rather than adding a second band to the top of the
screen. Nothing is pinned to the bottom of the viewport at all. The jump-to control
lives in the right page margin as a rail of dashes with labels on hover, and
collapses into a Contents menu inside the existing nav below `lg`, where the margin
is too narrow for a rail.

`scroll-padding-top: 5.5rem` on `<html>` clears the nav for every jump, including
the footnote anchors — so no element should carry its own `scroll-mt-*`, or the two
stack and overshoot.

The scroll-spy measures section offsets once and re-measures only on resize and on
`document.fonts.ready`. Its scroll handler is passive, coalesced into one rAF, and
reads no layout, which is what keeps it off the critical path.

## Motion and graphics

The reveal viewport box is **expanded** past the screen (`margin: "320px 0px 420px
0px"`, `amount: 0`) rather than shrunk. An earlier version used `-60px`, which
required 60px of an element to be visible before it began animating — that is
exactly what makes text appear to trail the scroll. Throws are short (8px, 0.34s)
for the same reason: anything longer reads as lag on a fast scroll.

Motion carries intent rather than decorating every block: sections `reveal`, lists
`stagger` their own children, the hero skin parallaxes on scroll, and the tab
underline is a shared `layoutId`. Everything sits under `MotionConfig
reducedMotion="user"`, and the SMIL pulse in the loop diagram is gated on
`useReducedMotion()` separately, since `MotionConfig` does not reach SMIL.

Chart colors are an accent-plus-ink pair (`#d2533a` against `#151513`) rather than
two hues. The brand palette is entirely warm earth tones, and any two of them fail
CVD separation as a categorical pair — coral against emerald scores ΔE 4.2 for
protanopia. Separating by lightness instead scores 33.7, and both curves are
direct-labeled so identity never rests on color at all. If you add a series, run
the dataviz validator before picking its color.

Stack: Vite, React 19, Tailwind v4, framer-motion, lucide-react. Type is
Newsreader for serif and Inter for sans, loaded in `index.html`.
