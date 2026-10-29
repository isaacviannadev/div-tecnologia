"use client";

import { useEffect, useRef } from "react";

/* A decorative pointer follower. It sleeps when settled and stays absent until
   a mouse moves; keyboard, touch, and reduced-motion users keep native input. */
export function CursorDot() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let dispose = () => {};

    const setup = () => {
      dispose();
      dot.style.opacity = "0";
      if (reducedMotion.matches || !finePointer.matches) return;

      let x = 0;
      let y = 0;
      let targetX = 0;
      let targetY = 0;
      let scale = 1;
      let targetScale = 1;
      let frame = 0;
      let visible = false;

      const update = () => {
        frame = 0;
        x += (targetX - x) * 0.18;
        y += (targetY - y) * 0.18;
        scale += (targetScale - scale) * 0.18;
        const settled = Math.abs(targetX - x) < 0.1
          && Math.abs(targetY - y) < 0.1
          && Math.abs(targetScale - scale) < 0.01;
        if (settled) {
          x = targetX;
          y = targetY;
          scale = targetScale;
        }
        dot.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%) scale(${scale})`;
        if (!settled && visible) frame = window.requestAnimationFrame(update);
      };
      const schedule = () => {
        if (!frame && visible) frame = window.requestAnimationFrame(update);
      };
      const setTargetScale = (target: EventTarget | null) => {
        const interactive = target instanceof Element
          && target.closest("a,button,.svc,.cl-track .nm");
        targetScale = interactive ? 34 / 9 : 1;
      };
      const hide = () => {
        visible = false;
        dot.style.opacity = "0";
        window.cancelAnimationFrame(frame);
        frame = 0;
      };
      const onMove = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") { hide(); return; }
        targetX = event.clientX;
        targetY = event.clientY;
        setTargetScale(event.target);
        if (!visible) {
          // The first paint starts at the real pointer, never at the screen edge.
          x = targetX;
          y = targetY;
          scale = targetScale;
          dot.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%) scale(${scale})`;
          visible = true;
          dot.style.opacity = "1";
        }
        schedule();
      };
      const onOver = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        setTargetScale(event.target);
        schedule();
      };
      const onOut = (event: PointerEvent) => {
        if (!event.relatedTarget) hide();
      };
      const onVisibility = () => { if (document.hidden) hide(); };

      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerover", onOver, { passive: true });
      document.addEventListener("pointerout", onOut, { passive: true });
      window.addEventListener("blur", hide);
      document.addEventListener("visibilitychange", onVisibility);
      dispose = () => {
        hide();
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerover", onOver);
        document.removeEventListener("pointerout", onOut);
        window.removeEventListener("blur", hide);
        document.removeEventListener("visibilitychange", onVisibility);
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
  }, []);

  return (
    <div
      className="cursor-dot"
      ref={dotRef}
      aria-hidden="true"
      style={{ opacity: 0, transition: "opacity .16s" }}
    />
  );
}
