# Newsletter & Contato (MailerSend) — Design

_Data: 2026-06-02_

## Contexto

O app novo (`div-tecnologia-ds`, Next.js 16 / App Router / Tailwind v4, hoje 100%
estático) vai **substituir** o app atual (`div-tecnologia`, repo
`isaacviannadev/div-tecnologia`). O app atual já tem newsletter e contato
funcionando via **MailerSend**, e queremos trazer essa funcionalidade para o app
novo mantendo o visual brutalista já implementado.

### Como o app atual funciona (ponto de partida)

- Rota única `POST /api/mail` (`src/app/api/mail/route.ts`) usando o SDK `mailersend`.
- Env vars: `MAILERSEND_API_KEY`, `MAILERSEND_NEWSLETTER_TEMPLATE_ID`,
  `MAILERSEND_CONTACT_TEMPLATE_ID`. Remetente `contato@divtecnologia.com.br`
  (já verificado no MailerSend).
- **Newsletter**: `{ template: 'newsletter', email }` → e-mail de boas-vindas
  (template) para o inscrito. Não armazena lista.
- **Contato**: `{ template: 'contact', name, email, company, phone, message, budget }`
  → e-mail de confirmação para o usuário (`To`) + `BCC` para
  `contato@divtecnologia.com.br`, com os dados via `setPersonalization`.
- Cliente: hook `useMailer` (SWR mutation → `fetch POST /api/mail`); forms com
  `react-hook-form` + `zod` + `sonner` (toasts).

## Objetivos

1. Newsletter e contato reais no app novo, via MailerSend, **sem mudanças
   obrigatórias no lado do MailerSend** (templates/DNS/remetente continuam válidos).
2. Manter o **form de contato novo** (design brutalista, com chips de serviço).
3. Reusar a stack comprovada: `react-hook-form` + `zod` + `sonner` + hook `useMailer`.
4. Deixar o app pronto para substituir `isaacviannadev/div-tecnologia` no **mesmo repo**.

## Não-objetivos (YAGNI)

- Armazenamento de lista de inscritos / CRM (o atual também não tem).
- Campos `phone` e `budget` no contato (decisão: manter o form novo sem eles).
- Migrar para `next-intl` (o app novo usa um contexto PT/EN próprio).
- Captcha / rate-limiting avançado (pode ser um follow-up; ver "Riscos").

## Arquitetura

Adicionar **um** Route Handler dinâmico, `app/api/mail/route.ts`, portado do app
atual. As páginas continuam estáticas; apenas `/api/mail` é dinâmico, então o app
roda no runtime Node do Next (Vercel), como o app atual.

Novas dependências: `mailersend`, `react-hook-form`, `@hookform/resolvers`, `zod`,
`sonner`, `swr`.

### Contrato da API — `POST /api/mail`

Corpo JSON discriminado por `template`:

- **`newsletter`**: `{ template: 'newsletter', email: string }`
  - Idêntico ao atual: `setTemplateId(NEWSLETTER)`, `To: email`, assunto de
    boas-vindas. Remetente `Newsletter | Div Tecnologia <contato@divtecnologia.com.br>`.
- **`contact`**: `{ template: 'contact', name, email, company?, services?: string[], message }`
  - `To: Recipient(email, name)`, `Bcc: contato@divtecnologia.com.br`,
    `setTemplateId(CONTACT)`, remetente `Contato | Div Tecnologia`.
  - **Mensagem composta**: o servidor monta um `message` final que embute os
    serviços selecionados, p.ex.:
    `"{message}\n\nServiços de interesse: {services.join(', ')}"` (sem serviços,
    omite a linha). Isso garante que o e-mail mostre tudo mesmo sem alterar o
    template.
  - `setPersonalization([{ email, data: { name, email, company, services, message } }])`
    — envia também as chaves discretas para o template referenciar quando for
    atualizado.

Respostas: `200 { message }` em sucesso; `400 { error }` para corpo inválido
(email ausente/ inválido, ou contato sem `name`/`message`); `500 { error }` em
falha do MailerSend. Guard: se faltar `MAILERSEND_API_KEY`, responde `500` com
mensagem clara em vez de estourar.

> **Tarefa do lado MailerSend (do dono, não bloqueia o código):** simplificar o
> template de contato para referenciar `{{name}} {{email}} {{company}} {{services}}
> {{message}}` (sai `{{phone}}`/`{{budget}}`). Enquanto isso, a mensagem composta
> cobre a exibição.

### Validação (zod)

- Newsletter: `{ email: z.string().email() }`.
- Contato: `name` obrigatório, `email` válido obrigatório, `message` obrigatório;
  `company` opcional; `services: string[]` opcional (default `[]`).
- Mesmos schemas validam no cliente (erros inline) e no servidor (defesa).

## Componentes (cliente)

1. **`app/hooks/useMailer.ts`** — porta do hook atual (SWR `useSWRMutation` →
   `/api/mail`). Expõe `sendNewsletter(email)`, `sendContact(data)`, `isLoading`,
   `error`. Tipos discriminados (`newsletter` | `contact`).
2. **Newsletter (no `Footer.tsx`)** — substitui o "Enviado ✓" falso por
   `react-hook-form` + `zod`. Submit → `sendNewsletter` → toast sonner
   sucesso/erro. Mantém markup/estilo `.news`. Estado `isLoading` no botão.
3. **Contato (no `ContatoView.tsx`)** — substitui o estado local por
   `react-hook-form` + `zod`. Os **chips viram campo controlado `services[]`** do
   form (toggle adiciona/remove). Campos: `name`, `email`, `company`, `message`,
   `services`. Submit → `sendContact` → toast + `reset()` (limpa chips também).
   Mantém todo o estilo brutalista; botão usa `isLoading`.
4. **`<Toaster/>` (sonner)** — montado no `layout.tsx`, tema escuro alinhado ao
   ink/brutalismo (posição inferior-direita).
5. **Strings PT/EN** — mensagens de sucesso/erro/validação adicionadas ao
   `content.ts`, consumidas via `useLang()` (sem next-intl).

## Fluxo de dados

```
Form (RHF + zod) → useMailer.send* → fetch POST /api/mail
   → route.ts (revalida + monta mensagem) → MailerSend SDK → e-mail
   ← 200/4xx/5xx → toast (sonner) sucesso/erro + reset
```

## Erros & estados

- Cliente: erros de validação inline por campo (zod); falha de rede/servidor →
  toast de erro; sucesso → toast + reset; botão "Enviando…" durante `isLoading`.
- Servidor: try/catch como hoje; loga `console.error`; nunca vaza a API key.
- `prefers-reduced-motion` já respeitado pelo CSS existente.

## Substituição & deploy (mesmo repo)

- `.env.example` versionado com as 3 chaves (sem valores); `.env.local`
  (gitignored) com os valores reais reaproveitados do app atual.
- Vercel: configurar as 3 env vars `MAILERSEND_*` no projeto que serve o domínio.
- README do app novo ganha seção "Newsletter & Contato" + passo a passo de deploy
  e da substituição no repo `isaacviannadev/div-tecnologia`.

## Verificação / testes

- `npm run build` verde; rotas de página estáticas, `/api/mail` dinâmica.
- Dev: newsletter com email inválido → erro inline; válido → toast sucesso
  (com API key) ou toast de erro claro (sem key).
- Contato: required vazios → erros inline; preenchido + chips → toast sucesso e
  `/api/mail` `200`; conferir BCC/personalização no painel MailerSend quando houver key.
- Checagem de console limpa (sem erros/hydration) nas páginas com form.

## Riscos / observações

- **Sem rate-limit/captcha**: endpoint público de e-mail pode ser abusado.
  Fora de escopo agora; anotar como follow-up (honeypot + rate-limit simples).
- **Template do MailerSend** com `{{phone}}/{{budget}}`: coberto pela mensagem
  composta; atualização do template é tarefa do dono.
- App novo ainda **não é repositório git** localmente; a substituição se dá ao
  publicar no repo existente (mecânica documentada no README, executada quando o
  dono decidir).

## Lista de mudanças (arquivos)

- **Novos**: `app/api/mail/route.ts`, `app/hooks/useMailer.ts`,
  `.env.example`, `docs/superpowers/specs/2026-06-02-…-design.md` (este).
- **Alterados**: `app/components/Footer.tsx` (newsletter real),
  `app/components/ContatoView.tsx` (contato real + chips controlados via RHF),
  `app/layout.tsx` (`<Toaster/>`), `app/content.ts` (strings PT/EN de
  feedback/validação), `package.json` (deps), `README.md` (seção + deploy).
