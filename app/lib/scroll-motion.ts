/** Clamp scroll-derived values, including pages without scrollable height. */
export function clampProgress(value: number) {
  return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
}

/** A scene's complete passage through the viewport, in either direction. */
export function sceneProgress(top: number, height: number, viewport: number) {
  return clampProgress((viewport - top) / Math.max(1, viewport + height));
}

export function heroProgress(top: number, height: number) {
  return clampProgress(-top / Math.max(1, height));
}

/** Start at 70% of the viewport; finish when the section's bottom reaches 55%. */
export function processProgress(top: number, height: number, viewport: number) {
  return clampProgress((viewport * 0.7 - top) / Math.max(1, height + viewport * 0.15));
}

export function readingProgress(scrollY: number, height: number, viewport: number) {
  return clampProgress(scrollY / Math.max(1, height - viewport));
}
