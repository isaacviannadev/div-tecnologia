# DIV scroll motion verification

Verified on 2026-10-29. Existing branding, copy, routes, PT/EN content and mail
API behavior are preserved. The brief was authored from the existing site and
the requested refactor, without a new brand interview.

## Automated evidence

- `npm test`: 20 tests passed across four suites.
- `npm run typecheck`: passed.
- `npm run build -- --webpack`: production compilation, prerendering and tracing passed.
- `npm run test:e2e`: seven interaction scenarios passed after the final runtime changes.
- Two additional navigation/no-JavaScript scenarios passed. All nine scenarios
  are committed in `tests/motion.spec.ts` and run with `npm run test:e2e`.
- `git diff --check`: passed.

Browser checks cover scroll timelines in both directions, live reduced-motion
changes, the 360 × 640 mobile menu, client navigation, PT/EN, light theme,
contact success/error, newsletter success, stable submit width, visible ASCII
and readable progress messages, pending navigation, and no-JavaScript content.
Mail requests are intercepted; no actual messages were sent.

## Visual review

Inspected actual Chrome screenshots of the desktop hero (1440 × 1000), phone
hero (390 × 844), intermediate process timeline, and semantic-token panel.
The first hero inspection showed an unintended line wrap; a smaller responsive
type scale restored the intended three-line composition and kept both CTAs in
the opening desktop viewport. The phone composition uses shorter travel and
normal-flow process content. The process's active nodes and advancing rule
remain separate from readable stage descriptions.

The intended feeling curve was recognition → trust → clarity → curiosity →
confidence → control → conviction → readiness. Visual review confirmed the
process as the principal change in interaction; the token panel remains a short
secondary reveal. The close keeps its complete CTA instead of fading away.

## Integration findings

- A global App Router loading boundary could leave streamed content concealed
  without JavaScript. It was replaced with `MotionLink` / `useLinkStatus`, which
  decorates actual pending navigation while retaining the server-rendered page.
- A content export named `process` conflicted with Next's production compiler
  macro. The import now uses `processContent`.
- The existing dependency directory was incomplete; `npm ci` restored it.
- External-volume metadata interfered with test discovery and the Turbopack
  cache. Test discovery excludes metadata; local verification uses Webpack.
- Existing local file-mode differences and unrelated untracked documents were
  excluded from commits. The feature branches from remote main `8407045`.

## Limits

Responsive checks use Chrome emulation, not a physical iPhone or Android device.
Mail provider delivery was not exercised; its existing API tests passed and
browser submission outcomes were simulated. No production deployment was made.
Dependency installation reported existing audit advisories; broad dependency
upgrades are outside this motion refactor. The ASCII package has no new runtime
dependencies.

The first fingerprint registry was empty; the new technical delivery story has
no prior local row to collide with. The upstream skill remains unchanged.
