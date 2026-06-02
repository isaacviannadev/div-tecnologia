# DIV — Design Systems & Front-end Performance

Landing page for **DIV**, a consultancy specialised in Design Systems + front-end
performance with an "AI-aligned" thesis (foundations legible by humans *and* by AI
agents). Brutalist-technical direction: hairline grid, oversized Bricolage Grotesque
display type, JetBrains Mono labels, heavy motion. Bilingual PT/EN.

Built from a Claude Design (claude.ai/design) handoff bundle — the HTML/CSS/JS
prototype was recreated as a Next.js app.

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS v4** (build pipeline; the bespoke brutalist styles live in
  `app/globals.css` as design-token-driven CSS rather than utilities, to preserve
  the prototype's finely-tuned `clamp()` type scale, hairline grids and keyframes)
- Fonts via `next/font/google` — Bricolage Grotesque (display) + JetBrains Mono (mono)

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm run start
```

## Structure

Routes: `/` (home), `/servicos`, `/sobre`, `/contato`. Each route's `page.tsx`
is a thin server component that exports per-page `metadata` and renders a client
`*View`. Shared chrome (nav, language context, cursor dot, scroll-motion) lives in
the root layout so the **PT/EN choice persists across client navigation**.

| File | Role |
| --- | --- |
| `app/layout.tsx` | Root layout: fonts, `LangProvider`, `Nav`, `CursorDot`, `RouteMotion`, bg grid + scanline |
| `app/lang-context.tsx` | `LangProvider` / `useLang` — language state, persistence, `t()` + `html()` helpers |
| `app/content.ts` | Bilingual (PT/EN) content dictionary for every page |
| `app/page.tsx` · `app/{servicos,sobre,contato}/page.tsx` | Server pages: metadata + render the matching `*View` |
| `app/components/HomeView · ServicosView · SobreView · ContatoView` | Per-route client content |
| `app/components/Nav · Footer · CursorDot · RouteMotion · Stat · Logo` | Shared pieces (`Footer` has `full`/`minimal` variants) |
| `app/globals.css` | Design tokens + every component style and keyframe |
| `public/brand/` | Source brand SVGs (reference) |

`RouteMotion` re-scans `.reveal` / `[data-magnet]` on each route change (keyed on
`usePathname`), so reveals and magnetic buttons work after client navigation, not
just on fresh loads.

## Animations (ported faithfully)

Hero line `rise` + foot `fadein`, language-aware rotating hero word (2.4s),
ticker + dual client marquees (pause on hover), scanline, masked background grid,
reveal-on-scroll (IntersectionObserver + safety-net sweep), count-up stats,
nav scrolled border, lerp cursor dot, magnetic buttons, service fill / button
wipes, code-card token stagger. All gated by `prefers-reduced-motion`.

Reveals and count-ups are SSR-safe: the server renders the final, fully-visible
state, and motion is layered on only after mount (no blank flash for no-JS).

## Decisions / notes

- **Scope: all four pages** — home + Serviços, Sobre, Contato (`/servicos`,
  `/sobre`, `/contato`). "Processo" links to the home `#process` section.
- **Tweaks panel dropped.** The prototype loaded React+Babel from a CDN to drive a
  hidden design-tool "Tweaks" switcher. Per the handoff decision it was removed and
  the chosen defaults baked in: **ink** palette + **brand orange `#F4A13F`** accent
  (the single token `--accent` drives the whole UI, incl. the logo block).
- **Placeholder content to confirm with the client:** stat figures (−47% LCP, etc.)
  are illustrative, and `hello@divtecnologia.com.br` is a placeholder.

## Newsletter & Contato (Resend)

`POST /api/mail` (server route) sends through [Resend](https://resend.com):
- `{ template: 'newsletter', email }` → welcome email to the subscriber.
- `{ template: 'contact', name, email, company?, services?: string[], message }` →
  notification to `contato@divtecnologia.com.br` with **Reply-To** set to the
  submitter (so the team replies directly). Selected services are folded into the
  message; all user-provided fields are HTML-escaped.

Email bodies are inline-styled HTML built in `app/lib/mail.ts` (no external
templates). Client: `useMailer` (SWR) → forms use react-hook-form + zod + sonner
toasts; validation/feedback strings come from the PT/EN `content.ts` context.

### Env var

```
RESEND_API_KEY=
```

Setup: create a Resend account, **verify the domain `divtecnologia.com.br`**
(add the DNS records Resend gives you — SPF/DKIM), create an API key. Free tier:
3,000 emails/month, 100/day — sends to any recipient once the domain is verified.

Local: `cp .env.example .env.local` and fill in `RESEND_API_KEY`.

### Deploy (AWS Amplify, SSR)

1. Set `RESEND_API_KEY` in the Amplify app's environment variables.
2. `amplify.yml` writes it into `.env.production` at build so the Next SSR
   runtime can read it (Amplify doesn't inject console env into the SSR runtime
   by default). Pages stay static; only `/api/mail` is dynamic.

> Note: emails send from `contato@divtecnologia.com.br`, so that domain must be
> verified in Resend or sends will fail.

> Follow-up (out of scope): add a honeypot + simple rate-limit to `/api/mail`,
> and make the contact service chips keyboard-accessible (currently `<span>`s).
