"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/* Reveal-on-scroll + magnetic buttons, re-scanned on every route change.
   On client navigation the new page mounts with `.js` already on <html>, so
   `.reveal` starts at opacity:0 and depends entirely on this IO re-running. */
export function RouteMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // --- Reveal on scroll ---
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    const safety = window.setTimeout(() => {
      document.querySelectorAll(".reveal:not(.in)").forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight)
          el.classList.add("in");
      });
    }, 2600);

    // --- Magnetic buttons ---
    const cleanups: Array<() => void> = [];
    if (!RM && window.matchMedia("(hover:hover)").matches) {
      document.querySelectorAll<HTMLElement>("[data-magnet]").forEach((el) => {
        const onMove = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          const mx = e.clientX - (r.left + r.width / 2);
          const my = e.clientY - (r.top + r.height / 2);
          el.style.transform = `translate(${mx * 0.18}px,${my * 0.22}px)`;
        };
        const onLeave = () => {
          el.style.transform = "";
        };
        el.addEventListener("mousemove", onMove);
        el.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          el.removeEventListener("mousemove", onMove);
          el.removeEventListener("mouseleave", onLeave);
        });
      });
    }

    return () => {
      io.disconnect();
      window.clearTimeout(safety);
      cleanups.forEach((fn) => fn());
    };
  }, [pathname]);

  return null;
}
