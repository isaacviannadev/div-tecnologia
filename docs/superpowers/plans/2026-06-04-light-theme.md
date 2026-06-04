# Tema Light — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar um tema claro ("Pure") ao site da DIV, alternável por um botão manual sol/lua no nav, com persistência e sem flash de tema.

**Architecture:** Todo o site já é dirigido por CSS custom properties. O tema é trocado setando `data-palette` em `<html>`. Um `ThemeProvider` (espelhando o `LangProvider` existente) guarda a escolha em `localStorage` e reflete no atributo; um script inline pré-pintura evita FOUC. O default é o tema escuro (ink).

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind v4 (CSS custom properties), sonner.

> **Nota sobre testes:** O projeto não tem infra de teste para CSS nem para React/DOM (vitest roda em ambiente `node`, sem jsdom/RTL, e a suíte cobre só o mailer). Seguindo a convenção do projeto, este plano usa **verificação manual** no `npm run dev`. Não introduzimos jsdom/RTL — seria scope creep (YAGNI) para um ajuste de tema. Cada task termina em commit.

---

### Task 1: Paleta light + overrides de CSS

**Files:**
- Modify: `app/globals.css` (bloco de tokens em `:root`, ~linha 13-33; e fim do arquivo)

- [ ] **Step 1: Adicionar o bloco da paleta light**

Em `app/globals.css`, logo **após** o fechamento do bloco `:root{ ... }` (após a linha `}` que fecha em ~linha 33), inserir:

```css
/* palette: light ("Pure") — toggled via <html data-palette="light"> */
[data-palette="light"]{
  --bg:#ffffff;
  --surface:#f5f5f6;
  --fg:#0a0a0c;
  --muted:rgba(10,10,12,.58);
  --faint:rgba(10,10,12,.32);
  --line:rgba(10,10,12,.11);
  --line-strong:rgba(10,10,12,.24);
  --accent:#F4A13F;
  --accent-ink:#0a0a0a;
  --glow:rgba(244,161,63,.20);
}
```

- [ ] **Step 2: Override do filtro dos logos dos clientes**

Hoje `.cl-track .nm.logo img` usa `filter:brightness(0) invert(1)` (branco), invisível no claro. No **fim** de `app/globals.css`, adicionar:

```css
/* ============================================================
   Light-theme spot fixes (não herdam das variáveis)
   ============================================================ */
[data-palette="light"] .cl-track .nm.logo img{filter:brightness(0)}
[data-palette="light"] .code{box-shadow:0 30px 80px -30px rgba(0,0,0,.16)}
```

- [ ] **Step 3: Adicionar o estilo do botão de tema**

Ainda em `app/globals.css`, junto dos estilos de nav (após o bloco `.lang` que termina em ~linha 136, ou no fim do arquivo), adicionar:

```css
/* theme toggle (sun/moon) */
.theme-toggle{
  display:inline-flex;align-items:center;justify-content:center;
  width:34px;height:34px;color:var(--muted);
  border:1px solid var(--line-strong);border-radius:999px;
  transition:color .2s,border-color .2s;flex:none;
}
.theme-toggle:hover{color:var(--fg);border-color:var(--fg)}
.theme-toggle svg{width:16px;height:16px}
```

E dentro da media query `@media(max-width:820px){ ... }` (a que começa em ~linha 143), adicionar uma regra para esconder o botão na barra superior no mobile (ele aparece no painel):

```css
  .nav-right .theme-toggle{display:none}
```

- [ ] **Step 4: Verificar que o CSS compila**

Run: `npm run build`
Expected: build conclui sem erro (nenhuma página afetada ainda; só valida o CSS).

- [ ] **Step 5: Commit**

```bash
git add app/globals.css
git commit -m "feat(theme): light palette tokens and spot fixes"
```

---

### Task 2: ThemeProvider + ThemedToaster

**Files:**
- Create: `app/theme-context.tsx`

- [ ] **Step 1: Criar o contexto de tema**

Criar `app/theme-context.tsx` com o conteúdo completo abaixo. Espelha `app/lang-context.tsx` (mesmo padrão de boot/persistência) e exporta também um `ThemedToaster` que faz o sonner acompanhar o tema:

```tsx
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Toaster } from "sonner";

export type Theme = "ink" | "light";

type ThemeValue = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
};

const ThemeCtx = createContext<ThemeValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("ink");

  // Boot: restore the stored theme. The inline <head>/pre-paint script already
  // set <html data-palette> to avoid FOUC; this syncs React state to it.
  useEffect(() => {
    const stored = localStorage.getItem("div-theme");
    if (stored === "ink" || stored === "light") setTheme(stored);
  }, []);

  // Persist + reflect on <html data-palette>.
  useEffect(() => {
    localStorage.setItem("div-theme", theme);
    document.documentElement.dataset.palette = theme;
  }, [theme]);

  const toggle = useCallback(
    () => setTheme((t) => (t === "ink" ? "light" : "ink")),
    [],
  );

  return (
    <ThemeCtx.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
}

/** Toaster (sonner) que segue o tema ativo. Deve ficar dentro do ThemeProvider. */
export function ThemedToaster() {
  const { theme } = useTheme();
  return (
    <Toaster
      theme={theme === "light" ? "light" : "dark"}
      position="bottom-right"
      richColors
      closeButton
    />
  );
}
```

- [ ] **Step 2: Verificar tipos/compilação**

Run: `npx tsc --noEmit`
Expected: sem erros de tipo no novo arquivo. (Erros pré-existentes não relacionados, se houver, podem ser ignorados — confirmar que nenhum cita `theme-context.tsx`.)

- [ ] **Step 3: Commit**

```bash
git add app/theme-context.tsx
git commit -m "feat(theme): ThemeProvider context and themed Toaster"
```

---

### Task 3: Wire no layout — anti-flash, provider, Toaster

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Importar o provider e o ThemedToaster; remover o import direto do Toaster**

Em `app/layout.tsx`, trocar a linha:

```tsx
import { Toaster } from "sonner";
```

por:

```tsx
import { ThemeProvider, ThemedToaster } from "./theme-context";
```

(Manter os demais imports. O `Toaster` deixa de ser usado diretamente aqui.)

- [ ] **Step 2: Remover o `data-palette="ink"` hardcoded do `<html>`**

Trocar a linha (~37):

```tsx
    <html lang="pt-BR" data-palette="ink" className={`${bricolage.variable} ${jetbrainsMono.variable}`}>
```

por (sem o `data-palette`, que passa a ser definido pelo script inline):

```tsx
    <html lang="pt-BR" className={`${bricolage.variable} ${jetbrainsMono.variable}`}>
```

- [ ] **Step 3: Adicionar o script anti-flash como primeiro filho do `<body>`**

Logo após `<body>` abrir, antes de qualquer outro conteúdo, inserir o script. O corpo do `<body>` fica assim:

```tsx
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html:
              '(function(){try{var t=localStorage.getItem("div-theme");document.documentElement.dataset.palette=(t==="light"?"light":"ink");}catch(e){document.documentElement.dataset.palette="ink";}})();',
          }}
        />
        <ThemeProvider>
          <LangProvider>
            <div className="bg-grid" />
            <div className="scanline" />
            <Nav />
            {children}
            <CursorDot />
            <RouteMotion />
            <ThemedToaster />
          </LangProvider>
        </ThemeProvider>
      </body>
```

Pontos:
- O `<script>` é o **primeiro** filho do `<body>`, então roda síncrono antes de o conteúdo do body pintar → sem flash de tema.
- `<ThemeProvider>` envolve `<LangProvider>` (ordem entre os dois é indiferente).
- `<Toaster ... />` foi substituído por `<ThemedToaster />` (que está dentro do `ThemeProvider`).

- [ ] **Step 4: Verificar compilação e ausência de FOUC**

Run: `npm run build && npm run dev`
Then: abrir `http://localhost:3000`, e no DevTools console rodar `localStorage.setItem("div-theme","light")` e dar reload.
Expected: a página carrega **já no tema claro**, sem piscar escuro. `<html>` tem `data-palette="light"`. Reverter: `localStorage.setItem("div-theme","ink")` + reload → carrega escuro.

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx
git commit -m "feat(theme): anti-FOUC script, ThemeProvider wiring, themed Toaster"
```

---

### Task 4: Botão de tema no Nav (desktop + mobile)

**Files:**
- Modify: `app/components/Nav.tsx`

- [ ] **Step 1: Consumir o tema no componente**

Em `app/components/Nav.tsx`, adicionar o import e ler o hook. Trocar a linha:

```tsx
import { useLang } from "../lang-context";
```

por:

```tsx
import { useLang } from "../lang-context";
import { useTheme } from "../theme-context";
```

E dentro de `export function Nav()`, após `const { lang, setLang, t } = useLang();`, adicionar:

```tsx
  const { theme, toggle } = useTheme();
```

- [ ] **Step 2: Definir o elemento do botão (com ícones sol/lua)**

No corpo do componente, logo **após** a definição de `const langToggle = (...)` (termina em ~linha 59), adicionar:

```tsx
  const themeToggle = (
    <button
      type="button"
      className="theme-toggle"
      aria-label={theme === "light" ? "Ativar tema escuro" : "Ativar tema claro"}
      onClick={toggle}
    >
      {theme === "light" ? (
        // lua → clicar volta pro escuro
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" strokeLinejoin="round" />
        </svg>
      ) : (
        // sol → clicar vai pro claro
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
```

- [ ] **Step 3: Inserir o botão no nav-right (desktop) antes do langToggle**

Em `.nav-right`, trocar:

```tsx
        <div className="nav-right">
          {langToggle}
```

por:

```tsx
        <div className="nav-right">
          {themeToggle}
          {langToggle}
```

- [ ] **Step 4: Inserir o botão no painel mobile**

Em `.nav-panel-foot`, trocar:

```tsx
        <div className="nav-panel-foot">
          {langToggle}
```

por:

```tsx
        <div className="nav-panel-foot">
          {themeToggle}
          {langToggle}
```

- [ ] **Step 5: Verificar tipos**

Run: `npx tsc --noEmit`
Expected: sem erros citando `Nav.tsx`.

- [ ] **Step 6: Commit**

```bash
git add app/components/Nav.tsx
git commit -m "feat(theme): sun/moon toggle button in nav (desktop + mobile)"
```

---

### Task 5: Verificação manual e ajuste do cursor-dot (se necessário)

**Files:**
- (eventual) Modify: `app/globals.css`

- [ ] **Step 1: Rodar o dev server**

Run: `npm run dev` → abrir `http://localhost:3000`.

- [ ] **Step 2: Checklist visual nas 4 páginas**

Clicar no botão sol/lua e percorrer `/`, `/servicos`, `/sobre`, `/contato` em **ambos** os temas, conferindo:
- [ ] Botão alterna o tema e o ícone muda (sol↔lua).
- [ ] Escolha persiste após reload (e sem flash — FOUC).
- [ ] Escolha persiste em navegação client-side entre páginas.
- [ ] Logos dos clientes (marquee na home) **visíveis** no claro (pretos, não sumidos).
- [ ] Texto `--muted`/`--faint` legível sobre branco; linhas/bordas visíveis.
- [ ] Card de código com sombra suave (não pesada) no claro.
- [ ] Toaster aparece no tema certo ao enviar o form de contato (testar envio).
- [ ] Botão de tema visível no menu mobile (largura ≤ 820px) e oculto na barra superior mobile.

- [ ] **Step 3: Avaliar o cursor-dot no claro**

O `.cursor-dot` usa `mix-blend-mode:difference`. No fundo branco ele tende a render azulado. Avaliar se destoa. **Só se** ficar ruim, adicionar em `app/globals.css`:

```css
[data-palette="light"] .cursor-dot{mix-blend-mode:normal}
```

(Se estiver aceitável, não mexer — YAGNI.)

- [ ] **Step 4: Commit final (se houve ajuste) e confirmação**

Se o Step 3 alterou CSS:

```bash
git add app/globals.css
git commit -m "fix(theme): cursor-dot blend mode on light palette"
```

Caso contrário, nada a commitar — a feature está completa.

---

## Notas de cobertura (spec → tasks)

- Paleta "Pure" → Task 1.
- ThemeProvider + persistência + `data-palette` → Task 2/3.
- Anti-flash (FOUC) → Task 3.
- Botão sol/lua (desktop + mobile) → Task 1 (CSS) + Task 4 (markup).
- Fix logos / sombra do código / Toaster → Task 1 + Task 2/3.
- Verificação manual nas 4 páginas → Task 5.
- Fora de escopo (prefers-color-scheme, multi-paleta) → não implementado, por design.
