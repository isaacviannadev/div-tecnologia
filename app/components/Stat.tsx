"use client";

import { useEffect, useRef, useState } from "react";

/* Count-up stat: renders the final value for SSR / no-JS, then resets to 0
   and eases up when scrolled into view (IO threshold .5, cubic ease). */
export function Stat({
  count,
  dec,
  unit,
  label,
}: {
  count: number;
  dec: number;
  unit: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(count.toFixed(dec));

  useEffect(() => {
    const RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (RM) {
      setDisplay(count.toFixed(dec));
      return;
    }
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          io.unobserve(en.target);
          const dur = 1400;
          let t0: number | null = null;
          const step = (ts: number) => {
            if (t0 === null) t0 = ts;
            const p = Math.min((ts - t0) / dur, 1);
            const e = 1 - Math.pow(1 - p, 3);
            setDisplay((count * e).toFixed(dec));
            if (p < 1) raf = requestAnimationFrame(step);
          };
          setDisplay((0).toFixed(dec));
          raf = requestAnimationFrame(step);
        });
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [count, dec]);

  return (
    <div className="stat">
      <div className="v" ref={ref}>
        {display}
        <span className="u">{unit}</span>
      </div>
      <div className="l">{label}</div>
    </div>
  );
}
