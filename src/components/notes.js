// Every empirical claim on the page is registered here and rendered into the Notes
// section. Sources match the Vivida pitch deck. `status: 'pending'` renders a visible
// marker so an unsourced figure cannot ship by accident.
export const NOTES = [
  {
    id: 1,
    claim:
      "58% of adults with Type 1 diabetes in a 2025 North American registry said they do not wear a medical ID.",
    source:
      "Messier et al., Diabetes Care 48(5), 2025. BETTER registry, n = 2,302 adults with Type 1 diabetes, Quebec; 41.6% reported wearing a medical ID.",
    status: "cited",
  },
  {
    id: 2,
    claim:
      "Roughly 5% of young Australians with Type 1 diabetes held an active medical-ID subscription, and 1.8% of those subscribers carried engraved emergency instructions.",
    source:
      "Heath, Torpy & Rushworth, Endocrine 79(1), 2023. National MedicAlert Australia data, ages 0 to 24.",
    status: "cited",
  },
  {
    id: 3,
    claim:
      "Non-wear is linked to identity concerns rather than to cost or availability, including among wearers who feel a continuous glucose monitor already communicates the condition.",
    source:
      "Messier et al., Diabetes Care 48(5), 2025. The BETTER registry authors draw this link directly.",
    status: "cited",
  },
  {
    id: 4,
    claim:
      "People discount delayed benefits steeply against immediate costs, and re-make the same decision differently each time it comes around.",
    source:
      "Laibson, Quarterly Journal of Economics 112(2), 1997. O’Donoghue & Rabin, American Economic Review 89(1), 1999.",
    status: "cited",
  },
  {
    id: 5,
    claim:
      "A nudge alters the choice architecture without forbidding any option or meaningfully changing economic incentives.",
    source: "Thaler & Sunstein, Nudge, 2008. The definition is theirs.",
    status: "cited",
  },
  {
    id: 6,
    claim:
      "The buyer and the wearer are frequently different people, most sharply in the pediatric allergy segment.",
    source:
      "Ecdysis segment analysis. Discovery interviews across allergy, Type 1, epilepsy and EMS are scheduled but not yet run.",
    status: "pending",
  },
  {
    id: 7,
    claim:
      "NFC read behavior varies by handset and operating system, which is why the QR fallback stays visually prominent.",
    source:
      "Ecdysis internal device testing. Stage-2 works-like prototype; tap success rate, time-to-information and read consistency after bend, sweat and abrasion are still to be measured.",
    status: "internal",
  },
];
