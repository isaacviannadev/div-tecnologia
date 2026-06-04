# Tema Light — Design

**Data:** 2026-06-04
**Status:** Aprovado, pronto para plano de implementação

## Objetivo

Adicionar um tema claro ao site da DIV, alternável por um botão manual no nav.
O tema escuro atual (ink) continua o padrão; o usuário pode trocar para o claro
e a escolha persiste entre sessões.

## Decisões (fechadas com o usuário)

- **Direção visual:** "Pure" — branco puro, alto contraste, técnico. O laranja da
  marca (`#F4A13F`) permanece o acento.
- **Disparo:** botão manual no nav. **Não** segue `prefers-color-scheme`.
- **Default:** escuro (ink) no primeiro acesso.

## Arquitetura

O site inteiro já é dirigido por CSS custom properties (`--bg`, `--surface`,
`--fg`, `--muted`, `--faint`, `--line`, `--line-strong`, `--accent`,
`--accent-ink`, `--glow`). Trocar de tema = trocar o valor dessas variáveis via
um atributo em `<html>`. O `<html>` já carrega `data-palette="ink"` — o design
sempre antecipou múltiplas paletas.

### 1. Paleta (`app/globals.css`)

`:root` permanece como está (tema escuro ink — default). Adicionar um bloco de
override:

```css
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

`--accent-ink` permanece `#0a0a0a` (texto escuro sobre o laranja), pois o acento
não muda entre temas.

### 2. Estado e persistência (`app/theme-context.tsx`)

Novo `ThemeProvider`, espelhando o `LangProvider` existente (`app/lang-context.tsx`):

- `type Theme = "ink" | "light"`
- Estado React (`useState<Theme>("ink")`).
- Boot (`useEffect`): lê `localStorage.getItem("div-theme")`; se for `"ink"` ou
  `"light"`, aplica.
- Persiste (`useEffect`): `localStorage.setItem("div-theme", theme)` e
  `document.documentElement.dataset.palette = theme`.
- Expõe `{ theme, setTheme, toggle }` via context + hook `useTheme()`.

Montado em `app/layout.tsx`, envolvendo o conteúdo (junto do `LangProvider`).

### 3. Anti-flash / FOUC (`app/layout.tsx`)

O `data-palette="ink"` hardcoded no SSR sai do JSX. No lugar, um script inline
**blocking** como primeiro filho do `<body>`, que roda antes da pintura:

```js
(function(){try{var t=localStorage.getItem("div-theme");
document.documentElement.dataset.palette=(t==="light"?"light":"ink");}catch(e){
document.documentElement.dataset.palette="ink";}})();
```

Sem isso, um usuário que escolheu light veria um flash do tema escuro a cada
carregamento antes da hidratação. Implementado como `<script
dangerouslySetInnerHTML>` como primeiro filho do `<body>` no `layout.tsx`
(App Router) — roda síncrono antes de o conteúdo do body pintar, garantindo o
atributo já setado na primeira pintura. O `<html>` recebe
`suppressHydrationWarning` (o atributo é setado fora do render do React).

### 4. Botão no nav (`app/components/Nav.tsx`)

Botão ícone sol/lua (estilo mono brutalista, coerente com o nav atual):

- Mostra o ícone do tema **alvo**: sol quando o escuro está ativo (clicar →
  claro); lua quando o claro está ativo (clicar → escuro).
- `onClick={toggle}`.
- `aria-label` descritivo (ex.: "Ativar tema claro" / "Ativar tema escuro").
- Posicionado em `.nav-right`, ao lado do pill PT/EN (`langToggle`).
- Replicado no menu mobile, em `.nav-panel-foot`.

Estilo do botão segue o `globals.css` (cor `var(--muted)` → `var(--fg)` no hover,
como os demais controles do nav).

### 5. Ajustes pontuais (não automáticos)

Três pontos não herdam das variáveis e precisam de override no tema claro:

1. **Logos dos clientes** (`globals.css`, `.cl-track .nm.logo img`): hoje
   `filter:brightness(0) invert(1)` força tudo a branco — invisível no fundo
   claro. Override sob `[data-palette="light"]` para `filter:brightness(0)`
   (preto).
2. **Sombra do card de código** (`globals.css`, `.code`): `box-shadow` com
   `rgba(0,0,0,.6)` é pesada demais no claro. Suavizar sob
   `[data-palette="light"]` (ex.: opacidade ~`.12`–`.18`).
3. **Toaster / sonner** (`app/layout.tsx`): hoje `theme="dark"` fixo. Passar a
   acompanhar o tema (`theme={theme === "light" ? "light" : "dark"}`), o que
   exige que o `<Toaster>` esteja dentro do `ThemeProvider` (ou ler o tema via
   hook num pequeno wrapper client).

Pontos verificados que **não** precisam de ação: `bg-grid`, `scanline`,
`::selection`, botões, formulários e o cursor-dot (`mix-blend-mode:difference`)
adaptam-se via variáveis ou comportam-se de forma aceitável no claro. Confirmar o
cursor-dot na verificação manual; ajustar só se destoar.

## Testes / Verificação

Não há testes de CSS no projeto (a suíte cobre o mailer). Verificação manual com
`npm run dev`, alternando o botão nas quatro páginas — home (`/`), serviços
(`/servicos`), sobre (`/sobre`), contato (`/contato`) — conferindo:

- Sem flash de tema no reload (FOUC).
- Persistência após reload e navegação client-side.
- Logos dos clientes visíveis no claro.
- Contraste de texto legível (muted/faint sobre branco).
- Toaster no tema certo ao enviar o formulário de contato.

## Fora de escopo (YAGNI)

- Seguir `prefers-color-scheme` automaticamente.
- Mais de duas paletas / theming configurável.
- Transição animada elaborada além do `transition` de `background`/`color` que o
  `body` já tem.
