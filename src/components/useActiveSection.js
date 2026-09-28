import { useEffect, useState } from "react";

/**
 * Which section the reader is currently in.
 *
 * Offsets are measured once and re-measured only on resize, so the scroll handler
 * itself does no layout reads. The handler is coalesced into a single rAF and the
 * listener is passive, which keeps it off the critical path of the scroll.
 */
export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    let tops = [];
    let frame = 0;

    const measure = () => {
      tops = ids.map((id) => {
        const el = document.getElementById(id);
        return {
          id,
          top: el ? el.getBoundingClientRect().top + window.scrollY : 0,
        };
      });
    };

    const read = () => {
      frame = 0;
      // The line the reader is actually reading at, not the top of the window.
      const line = window.scrollY + window.innerHeight * 0.32;
      let current = tops[0]?.id ?? ids[0];
      for (const t of tops) {
        if (t.top <= line) current = t.id;
      }
      // The last section can be too short to ever cross the line at the page foot.
      if (
        window.innerHeight + window.scrollY >=
        document.body.scrollHeight - 2
      ) {
        current = ids[ids.length - 1];
      }
      setActive(current);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    // Fonts landing late shift every offset on the page.
    document.fonts?.ready.then(onResize).catch(() => {});

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [ids]);

  return active;
}
