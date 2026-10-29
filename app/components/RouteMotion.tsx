"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useLang } from "../lang-context";
import {
  heroProgress,
  processProgress,
  readingProgress,
  sceneProgress,
} from "../lib/scroll-motion";

const sceneSelector = "[data-scroll-scene], [data-hero-scene], [data-process-scene]";
const motionSelector = `.reveal, [data-magnet], ${sceneSelector}`;

/** Native scrolling drives CSS variables, without React renders or an idle loop. */
export function RouteMotion() {
  const pathname = usePathname();
  const { lang } = useLang();

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let dispose = () => {};

    const setup = () => {
      dispose();
      const reduced = reducedMotion.matches;
      const root = document.documentElement;
      const scenes = new Set<HTMLElement>();
      const reveals = new Set<HTMLElement>();
      const magnets = new Map<HTMLElement, () => void>();
      let frame = 0;
      let needsDiscovery = true;
      let stopped = false;

      const show = (element: HTMLElement) => {
        element.classList.add("in");
        element.classList.remove("motion-pending");
        revealObserver?.unobserve(element);
      };

      const revealObserver = !reduced && "IntersectionObserver" in window
        ? new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) show(entry.target as HTMLElement);
            });
          }, { threshold: 0, rootMargin: "0px 0px -6% 0px" })
        : null;

      const discover = () => {
        needsDiscovery = false;
        document.querySelectorAll<HTMLElement>(sceneSelector).forEach((el) => scenes.add(el));
        document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => {
          if (reveals.has(el)) return;
          reveals.add(el);
          // Existing SSR content stays visible. Only unseen content is enhanced.
          if (!revealObserver || el.classList.contains("in") || el.getBoundingClientRect().top < window.innerHeight) {
            show(el);
          } else {
            el.classList.add("motion-pending");
            revealObserver.observe(el);
          }
        });

        if (!reduced && finePointer.matches) {
          document.querySelectorAll<HTMLElement>("[data-magnet]").forEach((el) => {
            if (magnets.has(el)) return;
            const originalTranslate = el.style.translate;
            const onMove = (event: PointerEvent) => {
              if (event.pointerType !== "mouse") return;
              const bounds = el.getBoundingClientRect();
              const x = event.clientX - (bounds.left + bounds.width / 2);
              const y = event.clientY - (bounds.top + bounds.height / 2);
              el.style.translate = `${x * 0.12}px ${y * 0.16}px`;
            };
            const reset = () => { el.style.translate = originalTranslate; };
            el.addEventListener("pointermove", onMove);
            el.addEventListener("pointerleave", reset);
            el.addEventListener("blur", reset);
            magnets.set(el, () => {
              el.removeEventListener("pointermove", onMove);
              el.removeEventListener("pointerleave", reset);
              el.removeEventListener("blur", reset);
              reset();
            });
          });
        }

        scenes.forEach((el) => { if (!el.isConnected) scenes.delete(el); });
        reveals.forEach((el) => {
          if (!el.isConnected) {
            revealObserver?.unobserve(el);
            reveals.delete(el);
          }
        });
        magnets.forEach((cleanup, el) => {
          if (!el.isConnected) { cleanup(); magnets.delete(el); }
        });
      };

      const update = () => {
        frame = 0;
        if (stopped) return;
        if (needsDiscovery) discover();
        const viewport = window.innerHeight;
        const pageProgress = readingProgress(window.scrollY, root.scrollHeight, viewport);
        // Read geometry together before writing any scene styles.
        const measurements = Array.from(scenes, (el) => ({ el, rect: el.getBoundingClientRect() }));
        root.style.setProperty("--scroll-progress", pageProgress.toFixed(4));
        measurements.forEach(({ el, rect }) => {
          if (el.hasAttribute("data-scroll-scene")) {
            el.style.setProperty("--scene-progress", (reduced ? 0.5 : sceneProgress(rect.top, rect.height, viewport)).toFixed(4));
          }
          if (el.hasAttribute("data-hero-scene")) {
            el.style.setProperty("--hero-progress", (reduced ? 0 : heroProgress(rect.top, rect.height)).toFixed(4));
          }
          if (el.hasAttribute("data-process-scene")) {
            const progress = reduced ? 1 : processProgress(rect.top, rect.height, viewport);
            el.style.setProperty("--process-progress", progress.toFixed(4));
            const steps = el.querySelectorAll<HTMLElement>(".step");
            steps.forEach((step, index) => {
              step.dataset.active = String(progress >= index / steps.length);
            });
          }
        });
      };

      const schedule = () => {
        if (!stopped && !frame) frame = window.requestAnimationFrame(update);
      };

      // Streamed route content can arrive after pathname changes. Ignore text and
      // ASCII glyph mutations so animation frames never trigger document scans.
      const mutationObserver = new MutationObserver((records) => {
        const changesMotionElements = records.some((record) =>
          [...record.addedNodes, ...record.removedNodes].some((node) =>
            node instanceof Element && (node.matches(motionSelector) || node.querySelector(motionSelector)),
          ),
        );
        if (changesMotionElements) { needsDiscovery = true; schedule(); }
      });
      mutationObserver.observe(document.body, { childList: true, subtree: true });

      const resizeObserver = "ResizeObserver" in window ? new ResizeObserver(schedule) : null;
      resizeObserver?.observe(document.body);

      const onFocus = (event: FocusEvent) => {
        if (!(event.target instanceof Element)) return;
        let ancestor: Element | null = event.target;
        while (ancestor) {
          if (ancestor instanceof HTMLElement && ancestor.matches(".reveal")) show(ancestor);
          ancestor = ancestor.parentElement;
        }
      };

      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule, { passive: true });
      window.addEventListener("pageshow", schedule);
      document.addEventListener("focusin", onFocus);
      document.fonts?.ready.then(schedule);
      schedule();

      dispose = () => {
        stopped = true;
        window.cancelAnimationFrame(frame);
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
        window.removeEventListener("pageshow", schedule);
        document.removeEventListener("focusin", onFocus);
        revealObserver?.disconnect();
        resizeObserver?.disconnect();
        mutationObserver.disconnect();
        magnets.forEach((cleanup) => cleanup());
        reveals.forEach((el) => el.classList.remove("motion-pending"));
        scenes.forEach((el) => {
          el.style.removeProperty("--scene-progress");
          el.style.removeProperty("--hero-progress");
          el.style.removeProperty("--process-progress");
          el.querySelectorAll<HTMLElement>(".step").forEach((step) => delete step.dataset.active);
        });
        root.style.removeProperty("--scroll-progress");
      };
    };

    setup();
    reducedMotion.addEventListener("change", setup);
    finePointer.addEventListener("change", setup);
    return () => {
      reducedMotion.removeEventListener("change", setup);
      finePointer.removeEventListener("change", setup);
      dispose();
    };
  }, [pathname, lang]);

  return null;
}
