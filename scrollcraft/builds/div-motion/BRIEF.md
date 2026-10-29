# DIV motion refactor

Authored implementation brief for the requested refactor of the existing site.
Brand, content, navigation, conversions and bilingual support are established by
the repository; no new brand interview or invented business claims are needed.

## Existing brief and implementation decisions

1. Vibe: technical, precise, editorial. Keep the existing Bricolage Grotesque,
   JetBrains Mono, ink background, paper foreground and DIV orange (#F4A13F).
2. Journey: keep the existing offer → experience → services → semantic tokens →
   results → process → manifesto → contact sequence.
3. Energy: a dimensional opening, quiet proof, a stronger process sequence,
   then a calm readable contact invitation.
4. Feeling: recognition in the headline, trust in the client experience,
   clarity in services, curiosity in the token example, confidence in the
   process, readiness at the closing CTA.
5. Signature: the process becomes a vertical delivery timeline. Its orange
   track advances with the reader; the current stage gains emphasis while all
   steps stay readable. This is an illustration of the method, not live data.
6. Range: preserve the site's existing technical/brutalist identity.
7. Distinct sections in natural document flow; no scroll hijacking or forced
   waiting. Desktop process heading holds alongside the advancing stages.
8. Assets: existing vector DIV mark, client logos, content and fonts. No
   generated imagery, video, external generation keys or new statistics.

## Grammar and layer contract

An existing service-site refactor, with an authored **technical delivery story**
grammar: persistent navigation, readable service rows, a sticky method index,
and a normal contact CTA. Bans: fake telemetry, cinematic video, locked scroll,
hidden essential copy, and fixed-duration page loaders. The eight stock
grammars would each replace existing navigation or useful content; preserving
the live site's conversion flow is the controlling constraint.

Hero planes: the background construction grid stays distant; an oversized
outline of the actual DIV mark sits behind the headline and shifts at a slower
rate; the headline group recedes subtly; a foreground rule crosses the visual
as it exits. Controls stay stable and usable. Mobile has shorter travel and a
smaller decorative mark. Reduced motion keeps the complete static composition.

## Feeling curve, peak and score

The peak: “The delivery path lit up as I worked through the stages.” The process
owns the most deliberate scroll room through four real descriptions, preceded
by the quieter results section. No empty pinned space is added.

| Beat | Feeling | Motion and purpose |
| --- | --- | --- |
| Hero | Recognition | Separate brand and type planes establish depth |
| Experience | Trust | Quiet existing client proof |
| Services | Clarity | Individual staggered entrances preserve reading order |
| Semantic tokens | Curiosity | A shallow independent panel movement |
| Results | Confidence | Existing real counters, motion preference respected |
| Process | Control | Sticky heading and scroll-linked delivery track |
| Manifesto | Conviction | Oversized quotation settles into view |
| Contact | Readiness | Stable CTA and real ASCII submission feedback |

Tell-someone sentence: “It is the site where the engineering process unfolds
into a clear delivery path as you read.”

Fingerprint gate: registry empty, first build. No prior row to clear.

## Integration and verification

The complete upstream skill is installed in `.cursor/skills/scroll-craft` at
upstream commit `75d81f74e83692add18cd7a8a8e078b8a887a579`, unchanged with its MIT
license. Its standalone engine remains available there; the existing Next/React
site uses a lifecycle-aware native adapter rather than a second global engine.
`ascii-reveal` is pinned to npm version 0.3.0.

Validate desktop, compact phone, English, light theme, reduced motion, keyboard
focus, client route transitions, streamed content, form waiting/success/error,
and no-JavaScript content. Browser form requests are intercepted in tests;
verification must not send actual inquiries or newsletters.
