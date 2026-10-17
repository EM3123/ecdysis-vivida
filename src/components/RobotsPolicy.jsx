import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Routes that must not be indexed.
const NOINDEX = new Set(["/investors"]);

const TAG_ID = "robots-policy";

/**
 * Owns the robots meta tag for the whole app.
 *
 * This deliberately has no cleanup function and holds no element reference. An
 * earlier version created the tag inside the investor page and removed it on
 * unmount, which broke under StrictMode's mount/cleanup/mount cycle: the stale
 * reference meant noindex leaked onto /research and went missing on /investors.
 * Reconciling from the live DOM on every location change has one owner and no
 * race.
 */
export default function RobotsPolicy() {
  const { pathname } = useLocation();

  useEffect(() => {
    const want = NOINDEX.has(pathname);
    let el = document.head.querySelector(`meta#${TAG_ID}`);

    if (want) {
      if (!el) {
        el = document.createElement("meta");
        el.id = TAG_ID;
        el.setAttribute("name", "robots");
        document.head.appendChild(el);
      }
      el.setAttribute("content", "noindex,nofollow");
    } else if (el) {
      el.remove();
    }
  }, [pathname]);

  return null;
}
