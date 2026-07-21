import { useEffect, useRef } from "react";
import { rastrear } from "../lib/analytics";

const MARCOS = [25, 50, 75, 100];

export function ScrollDepthTracker() {
  const disparados = useRef(new Set<number>());

  useEffect(() => {
    function handleScroll() {
      const altura = document.documentElement.scrollHeight - window.innerHeight;
      if (altura <= 0) return;
      const percentual = (window.scrollY / altura) * 100;

      for (const marco of MARCOS) {
        if (percentual >= marco && !disparados.current.has(marco)) {
          disparados.current.add(marco);
          rastrear("scroll_depth", { percentual: marco });
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return null;
}
