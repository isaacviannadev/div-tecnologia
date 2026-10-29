import { describe, expect, it } from "vitest";
import { heroProgress, processProgress, readingProgress, sceneProgress } from "./scroll-motion";

describe("scroll timeline boundaries", () => {
  it("maps a scene's entrance, midpoint, and exit without overshoot", () => {
    expect(sceneProgress(1000, 600, 1000)).toBe(0);
    expect(sceneProgress(200, 600, 1000)).toBe(0.5);
    expect(sceneProgress(-600, 600, 1000)).toBe(1);
    expect(sceneProgress(-2000, 600, 1000)).toBe(1);
    expect(sceneProgress(1500, 600, 1000)).toBe(0);
  });

  it("keeps the hero in its opening pose until scrolling and reverses naturally", () => {
    expect(heroProgress(0, 800)).toBe(0);
    expect(heroProgress(-400, 800)).toBe(0.5);
    expect(heroProgress(-800, 800)).toBe(1);
    expect(heroProgress(100, 800)).toBe(0);
  });

  it("resolves the process before the section leaves the reading area", () => {
    expect(processProgress(700, 600, 1000)).toBe(0);
    expect(processProgress(325, 600, 1000)).toBe(0.5);
    expect(processProgress(-50, 600, 1000)).toBe(1);
  });

  it("handles a short page, zero geometry, and overscroll without invalid styles", () => {
    expect(readingProgress(0, 600, 1000)).toBe(0);
    expect(readingProgress(1000, 2000, 1000)).toBe(1);
    expect(readingProgress(-50, 2000, 1000)).toBe(0);
    expect(heroProgress(0, 0)).toBe(0);
    expect(sceneProgress(0, 0, 0)).toBe(0);
  });
});
