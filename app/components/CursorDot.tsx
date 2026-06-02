"use client";

import { useEffect, useRef } from "react";

/* Lerp-following cursor dot that grows over interactive targets.
   Mounted once in the layout; CSS hides it on touch / reduced-motion. */
export function CursorDot() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (RM || !window.matchMedia("(hover:hover) and (pointer:fine)").matches)
      return;
    const dot = dotRef.current;
    if (!dot) return;
    let dx = window.innerWidth / 2,
      dy = window.innerHeight / 2,
      cx = dx,
      cy = dy,
      raf = 0;
    const onMove = (e: MouseEvent) => {
      dx = e.clientX;
      dy = e.clientY;
    };
    const onOver = (e: MouseEvent) => {
      const hot = (e.target as Element).closest("a,button,.svc,.cl-track .nm");
      dot.style.width = hot ? "34px" : "9px";
      dot.style.height = hot ? "34px" : "9px";
    };
    const loop = () => {
      cx += (dx - cx) * 0.18;
      cy += (dy - cy) * 0.18;
      dot.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    loop();
    return () => {
      removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div className="cursor-dot" ref={dotRef} />;
}
