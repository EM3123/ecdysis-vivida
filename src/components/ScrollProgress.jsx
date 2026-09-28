import { motion, useScroll } from "framer-motion";

/**
 * Reading progress, drawn along the bottom edge of the fixed nav so it doubles as
 * that bar's border instead of adding a second band to the top of the screen.
 *
 * Driven straight off the scroll value with no spring, because a spring here would
 * visibly trail the scroll. scaleX is compositor-only, so it never triggers layout.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: scrollYProgress }}
      className="fixed top-16 left-0 z-60 h-[2px] w-full origin-left bg-gradient-to-r from-gold-800 via-gold-600 to-gold-600"
    />
  );
}
