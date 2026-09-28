// One vocabulary of motion for the page, so movement carries intent instead of
// decorating every block identically. Sections reveal; lists stagger their own
// children; nothing travels further than it has to.

// The detection box is EXPANDED past the viewport rather than shrunk, so a block
// has finished arriving by the time it is actually on screen. The old value
// (-60px) required 60px of the element to be visible first, which is precisely
// what makes text appear to trail the scroll. `amount: 0` fires on first contact.
export const VIEWPORT = {
  once: true,
  amount: 0,
  margin: "320px 0px 420px 0px",
};

const EASE = [0.22, 1, 0.36, 1];

/** A section or a single block arriving. Short, and barely moves. */
export const reveal = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.34, ease: EASE } },
};

/** A heavier arrival, for the one dark section that should land differently. */
export const revealSlow = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

/** An item inside a staggered list. */
export const item = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE } },
};

/** A container whose children arrive in sequence. */
export const stagger = (gap = 0.05, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});

/** A rule or divider drawing itself in. */
export const draw = {
  hidden: { opacity: 0, scaleX: 0 },
  show: {
    opacity: 1,
    scaleX: 1,
    transition: { duration: 0.6, ease: EASE },
  },
};
