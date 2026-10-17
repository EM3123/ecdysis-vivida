// ─────────────────────────────────────────────────────────────────────────────
// VIVIDA — FINANCIAL INPUTS
//
// Every figure below is null until Edmund supplies it. Nothing here is invented,
// estimated, or derived from a comparable company. The page renders a visible
// "not yet supplied" state for any null and refuses to show a runway number it
// cannot actually compute, because a model showing $0 burn and infinite runway
// is worse than a model showing nothing.
//
// The line-item LABELS are real — they come from the deck's own roadmap and
// landed-COGS definition. They are the things that will cost money. Only the
// amounts are missing.
//
// To fill this in: replace each `null` with a number in whole US dollars.
// ─────────────────────────────────────────────────────────────────────────────

export const FINANCIALS = {
  // The month these figures are true as of, e.g. "2026-10".
  asOf: null, // REQUIRED

  // Cash in the bank today, across all accounts.
  cashOnHand: null, // REQUIRED

  // Money already committed but not yet spent (deposits owed, signed quotes).
  committed: null, // optional

  // ── Recurring monthly bills ────────────────────────────────────────────────
  // What leaves the account every month regardless of what you build.
  monthlyBills: [
    { key: "software", label: "Software and hosting", amount: null },
    { key: "domain", label: "Domain and email", amount: null },
    { key: "legal", label: "Legal and entity upkeep", amount: null },
    { key: "insurance", label: "Insurance", amount: null },
    {
      key: "stipends",
      label: "Founder stipends",
      amount: null,
      note: "Zero is a valid answer. Say so explicitly.",
    },
    { key: "other", label: "Other recurring", amount: null },
  ],

  // ── Planned one-off spend ──────────────────────────────────────────────────
  // `month` is an offset from asOf: 0 is this month, 1 is next month.
  // Stages come straight from the deck's roadmap: mold and read, pilot, launch.
  plannedSpend: [
    {
      month: null,
      label: "Stage-2 NFC prototype run (NTAG215 inlays, ferrite)",
      amount: null,
      stage: "Prototype",
    },
    {
      month: null,
      label: "Silicone mold tooling",
      amount: null,
      stage: "Prototype",
    },
    {
      month: null,
      label: "Wear test — 10 participants, 7 to 14 days",
      amount: null,
      stage: "Pilot",
    },
    {
      month: null,
      label: "Discovery interviews (25–35, incentives)",
      amount: null,
      stage: "Pilot",
    },
    {
      month: null,
      label: "Responder testing at UC Davis",
      amount: null,
      stage: "Pilot",
    },
    {
      month: null,
      label: "Supplier quotes and sample units",
      amount: null,
      stage: "Launch",
    },
    {
      month: null,
      label: "First production run",
      amount: null,
      stage: "Launch",
    },
    {
      month: null,
      label: "Photography and launch assets",
      amount: null,
      stage: "Launch",
    },
    { month: null, label: "Regulatory review", amount: null, stage: "Launch" },
  ],

  // ── Expected inflows ───────────────────────────────────────────────────────
  // Grants, prize money, deposits. Competition winnings are NOT revenue and
  // should not be modelled as recurring.
  inflows: [
    { month: null, label: "Refundable deposits", amount: null },
    { month: null, label: "Grant or prize", amount: null },
  ],

  // ── Unit economics ─────────────────────────────────────────────────────────
  // Price points are the deck's hypotheses. Landed COGS is unknown until two
  // supplier quotes come back; the deck flags the 60% margin target as unbacked.
  unitEconomics: {
    priceCore: 59, // deck hypothesis, to be tested with Van Westendorp
    pricePremium: 79, // deck hypothesis
    priceLimited: 89, // deck hypothesis
    landedCogs: null, // REQUIRED — silicone, steel, NFC inlay, ferrite, print,
    //                   assembly, packaging, QC, freight, duties, defects
    marginTargetPct: 60, // deck target, explicitly unbacked
  },

  // ── Sales plan ─────────────────────────────────────────────────────────────
  // Units expected to ship per month, by offset from asOf. Leave empty until
  // the waitlist gives you a real conversion rate to reason from.
  unitsByMonth: [], // e.g. [{ month: 9, units: 120 }]
};

const num = (v) => typeof v === "number" && Number.isFinite(v);
const sum = (xs) => xs.reduce((a, b) => a + b, 0);

/** Which required inputs are still missing, in plain language. */
export function missingInputs(f = FINANCIALS) {
  const gaps = [];
  if (!f.asOf) gaps.push("the month these figures are true as of");
  if (!num(f.cashOnHand)) gaps.push("cash on hand");
  if (!f.monthlyBills.some((b) => num(b.amount)))
    gaps.push("at least one monthly bill (enter 0 where it genuinely is 0)");
  if (!num(f.unitEconomics.landedCogs)) gaps.push("fully landed COGS per unit");
  return gaps;
}

/**
 * Build the model. Returns `ready: false` plus the gap list when the inputs
 * cannot support a real answer, rather than computing against zeros.
 */
export function buildModel(f = FINANCIALS, horizon = 24) {
  const gaps = missingInputs(f);
  const billed = f.monthlyBills.filter((b) => num(b.amount));
  const monthlyBurn = billed.length ? sum(billed.map((b) => b.amount)) : null;

  const canProject = num(f.cashOnHand) && num(monthlyBurn) && monthlyBurn > 0;

  if (!canProject) {
    return {
      ready: false,
      gaps,
      monthlyBurn,
      cashOnHand: f.cashOnHand,
      months: [],
      runwayMonths: null,
      zeroMonth: null,
    };
  }

  const grossMargin = num(f.unitEconomics.landedCogs)
    ? f.unitEconomics.priceCore - f.unitEconomics.landedCogs
    : null;

  let cash = f.cashOnHand;
  const months = [];
  let zeroMonth = null;

  for (let m = 0; m < horizon; m += 1) {
    const opening = cash;

    const oneOff = sum(
      f.plannedSpend
        .filter((p) => p.month === m && num(p.amount))
        .map((p) => p.amount),
    );
    const inflow = sum(
      f.inflows
        .filter((i) => i.month === m && num(i.amount))
        .map((i) => i.amount),
    );
    const units = f.unitsByMonth.find((u) => u.month === m)?.units ?? 0;
    const grossProfit = num(grossMargin) ? units * grossMargin : 0;

    const spend = monthlyBurn + oneOff;
    cash = opening - spend + inflow + grossProfit;

    if (zeroMonth === null && cash < 0) zeroMonth = m;

    months.push({
      month: m,
      opening,
      recurring: monthlyBurn,
      oneOff,
      inflow,
      grossProfit,
      closing: cash,
    });
  }

  // Runway on recurring burn alone, which is the number investors actually ask for.
  const runwayMonths = f.cashOnHand / monthlyBurn;

  return {
    ready: true,
    gaps,
    monthlyBurn,
    cashOnHand: f.cashOnHand,
    grossMargin,
    months,
    runwayMonths,
    zeroMonth,
  };
}

export const money = (v) =>
  num(v)
    ? v.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      })
    : null;
