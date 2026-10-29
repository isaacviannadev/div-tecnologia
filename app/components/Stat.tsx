"use client";

import { useEffect, useRef, useState } from "react";

/* Final values remain available for SSR/no-JS. A visible count animates once;
   changing to reduced motion resolves it immediately and cancels all work. */
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
    const el = ref.current;
    if (!el) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finalValue = count.toFixed(dec);
    let frame = 0;
    let observer: IntersectionObserver | null = null;
    let started = false;
    let finished = false;

    const finish = () => {
      finished = true;
      window.cancelAnimationFrame(frame);
      frame = 0;
      observer?.disconnect();
      setDisplay(finalValue);
    };
    const onMotionChange = () => {
      if (reducedMotion.matches) finish();
    };
    const onVisibility = () => {
      if (document.hidden && started) finish();
    };

    setDisplay(finalValue);
    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      finish();
    } else {
      observer = new IntersectionObserver((entries) => {
        if (started || finished || !entries.some((entry) => entry.isIntersecting)) return;
        started = true;
        observer?.disconnect();
        let start: number | null = null;
        const step = (time: number) => {
          frame = 0;
          if (finished || reducedMotion.matches) { finish(); return; }
          start ??= time;
          const progress = Math.min((time - start) / 1400, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay((count * eased).toFixed(dec));
          if (progress < 1) frame = window.requestAnimationFrame(step);
          else finish();
        };
        setDisplay((0).toFixed(dec));
        frame = window.requestAnimationFrame(step);
      }, { threshold: 0.5 });
      observer.observe(el);
    }

    reducedMotion.addEventListener("change", onMotionChange);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      finished = true;
      observer?.disconnect();
      window.cancelAnimationFrame(frame);
      reducedMotion.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", onVisibility);
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
