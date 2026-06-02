# Newsletter & Contato (MailerSend) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add real newsletter and contact submission to the new app via MailerSend, reusing the current app's `/api/mail` contract, while keeping the new brutalist forms.

**Architecture:** One dynamic Route Handler (`app/api/mail/route.ts`) parses + validates with zod and delegates to a testable mail service that builds MailerSend `EmailParams`. Pages stay static; only `/api/mail` is dynamic. Forms use react-hook-form + zod + sonner, talking to the route through a `useMailer` SWR hook. Validation/feedback strings come from the existing PT/EN `content.ts` context.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, `mailersend`, `react-hook-form`, `@hookform/resolvers`, `zod`, `sonner`, `swr`; Vitest for unit tests.

---

## File Structure

- **Create**
  - `app/lib/mail-schema.ts` — zod schemas + types (shared client/server).
  - `app/lib/mail.ts` — pure `buildContactMessage` + `sendMail(client, payload, templates)`.
  - `app/api/mail/route.ts` — POST handler (parse, validate, send, map responses).
  - `app/hooks/useMailer.ts` — SWR mutation client (`sendNewsletter`, `sendContact`).
  - `vitest.config.ts` — node test env.
  - `.env.example` — the 3 MailerSend vars (no values).
  - Tests: `app/lib/mail-schema.test.ts`, `app/lib/mail.test.ts`, `app/api/mail/route.test.ts`.
- **Modify**
  - `app/content.ts` — add `feedback` (PT/EN) for toasts + validation.
  - `app/layout.tsx` — mount sonner `<Toaster/>`.
  - `app/components/Footer.tsx` — newsletter via RHF + zod + useMailer.
  - `app/components/ContatoView.tsx` — contact via RHF + zod; chips → controlled `services[]`.
  - `package.json` — deps + `test` script.
  - `README.md` — "Newsletter & Contato" + deploy/replacement steps.

---

## Task 0: Initialize git + install dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Initialize a git repo (the app is not yet versioned)**

Run:
```bash
cd /Users/isaacvianna/DivTech/div-tecnologia-ds
git init -q && git add -A && git commit -q -m "chore: snapshot before newsletter/contato feature"
```
Expected: a repo with one commit. (This repo's content will later replace `isaacviannadev/div-tecnologia`.)

- [ ] **Step 2: Install runtime + test dependencies**

Run:
```bash
npm install mailersend react-hook-form @hookform/resolvers zod sonner swr
npm install -D vitest
```
Expected: installs succeed; `package.json` lists the new deps.

- [ ] **Step 3: Add the test script**

In `package.json`, add to `"scripts"`:
```json
"test": "vitest run"
```

- [ ] **Step 4: Create the Vitest config**

Create `vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["app/**/*.test.ts"],
  },
});
```

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "chore: add mailersend/forms deps and vitest"
```

---

## Task 1: Mail schemas (zod)

**Files:**
- Create: `app/lib/mail-schema.ts`
- Test: `app/lib/mail-schema.test.ts`

- [ ] **Step 1: Write the failing test**

Create `app/lib/mail-schema.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import {
  contactFormSchema,
  mailPayloadSchema,
  newsletterFormSchema,
} from "./mail-schema";

describe("newsletterFormSchema", () => {
  it("accepts a valid email", () => {
    expect(newsletterFormSchema.safeParse({ email: "a@b.com" }).success).toBe(true);
  });
  it("rejects an invalid email", () => {
    expect(newsletterFormSchema.safeParse({ email: "nope" }).success).toBe(false);
  });
});

describe("contactFormSchema", () => {
  it("requires name, email, message; defaults company/services", () => {
    const parsed = contactFormSchema.safeParse({
      name: "Ana",
      email: "a@b.com",
      message: "oi",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.company).toBe("");
      expect(parsed.data.services).toEqual([]);
    }
  });
  it("rejects empty name and bad email", () => {
    expect(
      contactFormSchema.safeParse({ name: "", email: "x", message: "" }).success,
    ).toBe(false);
  });
});

describe("mailPayloadSchema (discriminated by template)", () => {
  it("accepts a newsletter payload", () => {
    expect(
      mailPayloadSchema.safeParse({ template: "newsletter", email: "a@b.com" }).success,
    ).toBe(true);
  });
  it("accepts a contact payload", () => {
    expect(
      mailPayloadSchema.safeParse({
        template: "contact",
        name: "Ana",
        email: "a@b.com",
        company: "Div",
        services: ["Tokens"],
        message: "oi",
      }).success,
    ).toBe(true);
  });
  it("rejects an unknown template", () => {
    expect(mailPayloadSchema.safeParse({ template: "spam", email: "a@b.com" }).success).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run app/lib/mail-schema.test.ts`
Expected: FAIL — cannot resolve `./mail-schema`.

- [ ] **Step 3: Write the schemas**

Create `app/lib/mail-schema.ts`:
```ts
import { z } from "zod";

/** Client-side form schemas (no `template` discriminator). */
export const newsletterFormSchema = z.object({
  email: z.string().email(),
});

export const contactFormSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().email(),
  company: z.string().trim().optional().default(""),
  services: z.array(z.string()).optional().default([]),
  message: z.string().trim().min(1),
});

export type NewsletterFormValues = z.infer<typeof newsletterFormSchema>;
export type ContactFormValues = z.infer<typeof contactFormSchema>;

/** Server payload: form fields + the `template` discriminator. */
export const mailPayloadSchema = z.discriminatedUnion("template", [
  z.object({ template: z.literal("newsletter") }).merge(newsletterFormSchema),
  z.object({ template: z.literal("contact") }).merge(contactFormSchema),
]);

export type MailPayload = z.infer<typeof mailPayloadSchema>;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run app/lib/mail-schema.test.ts`
Expected: PASS (all cases).

- [ ] **Step 5: Commit**

```bash
git add app/lib/mail-schema.ts app/lib/mail-schema.test.ts
git commit -m "feat: zod schemas for newsletter/contact payloads"
```

---

## Task 2: Mail service (message builder + sender)

**Files:**
- Create: `app/lib/mail.ts`
- Test: `app/lib/mail.test.ts`

- [ ] **Step 1: Write the failing test**

Create `app/lib/mail.test.ts`:
```ts
import { describe, expect, it, vi } from "vitest";
import { buildContactMessage, sendMail, type MailClient } from "./mail";

const templates = { newsletter: "nl-tpl", contact: "ct-tpl" };

describe("buildContactMessage", () => {
  it("returns the message unchanged with no services", () => {
    expect(buildContactMessage("oi", [])).toBe("oi");
  });
  it("appends selected services", () => {
    expect(buildContactMessage("oi", ["Tokens", "Performance"])).toBe(
      "oi\n\nServiços de interesse: Tokens, Performance",
    );
  });
});

describe("sendMail", () => {
  function fakeClient() {
    const send = vi.fn().mockResolvedValue({});
    const client: MailClient = { email: { send } };
    return { client, send };
  }

  it("sends a newsletter email to the subscriber", async () => {
    const { client, send } = fakeClient();
    await sendMail(client, { template: "newsletter", email: "a@b.com" }, templates);
    expect(send).toHaveBeenCalledTimes(1);
    const params = send.mock.calls[0][0];
    expect(params.to[0].email).toBe("a@b.com");
    expect(params.templateId).toBe("nl-tpl");
  });

  it("sends a contact email with BCC and personalization including services", async () => {
    const { client, send } = fakeClient();
    await sendMail(
      client,
      {
        template: "contact",
        name: "Ana",
        email: "a@b.com",
        company: "Div",
        services: ["Tokens"],
        message: "oi",
      },
      templates,
    );
    const params = send.mock.calls[0][0];
    expect(params.to[0].email).toBe("a@b.com");
    expect(params.bcc[0].email).toBe("contato@divtecnologia.com.br");
    expect(params.templateId).toBe("ct-tpl");
    const data = params.personalization[0].data;
    expect(data.message).toContain("Serviços de interesse: Tokens");
    expect(data.services).toEqual(["Tokens"]);
  });

  it("propagates client send errors", async () => {
    const send = vi.fn().mockRejectedValue(new Error("boom"));
    await expect(
      sendMail({ email: { send } }, { template: "newsletter", email: "a@b.com" }, templates),
    ).rejects.toThrow("boom");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run app/lib/mail.test.ts`
Expected: FAIL — cannot resolve `./mail`.

- [ ] **Step 3: Write the mail service**

Create `app/lib/mail.ts`:
```ts
import { EmailParams, Recipient, Sender } from "mailersend";
import type { MailPayload } from "./mail-schema";

const SENDER_EMAIL = "contato@divtecnologia.com.br";
const NEWSLETTER_FROM = new Sender(SENDER_EMAIL, "Newsletter | Div Tecnologia");
const CONTACT_FROM = new Sender(SENDER_EMAIL, "Contato | Div Tecnologia");

/** Minimal shape we use from the MailerSend client — lets tests inject a fake. */
export type MailClient = {
  email: { send: (params: EmailParams) => Promise<unknown> };
};

/** Fold the selected service chips into the message body so the email shows
    everything even if the MailerSend template isn't updated. */
export function buildContactMessage(message: string, services: string[]): string {
  if (!services.length) return message;
  return `${message}\n\nServiços de interesse: ${services.join(", ")}`;
}

export async function sendMail(
  client: MailClient,
  payload: MailPayload,
  templates: { newsletter: string; contact: string },
): Promise<void> {
  if (payload.template === "newsletter") {
    const params = new EmailParams()
      .setFrom(NEWSLETTER_FROM)
      .setTo([new Recipient(payload.email)])
      .setSubject("Bem vindo à newsletter da Div Tecnologia")
      .setTemplateId(templates.newsletter);
    await client.email.send(params);
    return;
  }

  const fullMessage = buildContactMessage(payload.message, payload.services);
  const params = new EmailParams()
    .setFrom(CONTACT_FROM)
    .setTo([new Recipient(payload.email, payload.name)])
    .setBcc([new Recipient(SENDER_EMAIL)])
    .setPersonalization([
      {
        email: payload.email,
        data: {
          name: payload.name,
          email: payload.email,
          company: payload.company,
          services: payload.services,
          message: fullMessage,
        },
      },
    ])
    .setSubject("Recebemos sua mensagem, em breve retornaremos")
    .setTemplateId(templates.contact);
  await client.email.send(params);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run app/lib/mail.test.ts`
Expected: PASS (5 cases).

- [ ] **Step 5: Commit**

```bash
git add app/lib/mail.ts app/lib/mail.test.ts
git commit -m "feat: mailersend send service + service-aware message builder"
```

---

## Task 3: API route `POST /api/mail`

**Files:**
- Create: `app/api/mail/route.ts`
- Test: `app/api/mail/route.test.ts`

- [ ] **Step 1: Write the failing test**

Create `app/api/mail/route.test.ts`:
```ts
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock the service layer and the MailerSend client constructor.
vi.mock("../../lib/mail", () => ({ sendMail: vi.fn() }));
vi.mock("mailersend", () => ({ MailerSend: vi.fn().mockImplementation(() => ({})) }));

import { sendMail } from "../../lib/mail";
import { POST } from "./route";

function req(body: unknown) {
  return new Request("http://localhost/api/mail", {
    method: "POST",
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("POST /api/mail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.MAILERSEND_API_KEY = "key";
    process.env.MAILERSEND_NEWSLETTER_TEMPLATE_ID = "nl";
    process.env.MAILERSEND_CONTACT_TEMPLATE_ID = "ct";
  });
  afterEach(() => {
    delete process.env.MAILERSEND_API_KEY;
  });

  it("returns 200 on a valid newsletter payload", async () => {
    (sendMail as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
    const res = await POST(req({ template: "newsletter", email: "a@b.com" }));
    expect(res.status).toBe(200);
    expect(sendMail).toHaveBeenCalledOnce();
  });

  it("returns 400 on invalid body", async () => {
    const res = await POST(req({ template: "newsletter", email: "nope" }));
    expect(res.status).toBe(400);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("returns 500 when the API key is missing", async () => {
    delete process.env.MAILERSEND_API_KEY;
    const res = await POST(req({ template: "newsletter", email: "a@b.com" }));
    expect(res.status).toBe(500);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("returns 500 when the service throws", async () => {
    (sendMail as ReturnType<typeof vi.fn>).mockRejectedValue(new Error("boom"));
    const res = await POST(req({ template: "newsletter", email: "a@b.com" }));
    expect(res.status).toBe(500);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run app/api/mail/route.test.ts`
Expected: FAIL — cannot resolve `./route`.

- [ ] **Step 3: Write the route handler**

Create `app/api/mail/route.ts`:
```ts
import { MailerSend } from "mailersend";
import { NextResponse } from "next/server";
import { sendMail } from "../../lib/mail";
import { mailPayloadSchema } from "../../lib/mail-schema";

export async function POST(request: Request) {
  const apiKey = process.env.MAILERSEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Configuração de e-mail ausente (MAILERSEND_API_KEY)" },
      { status: 500 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = mailPayloadSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  try {
    const client = new MailerSend({ apiKey });
    await sendMail(client, parsed.data, {
      newsletter: process.env.MAILERSEND_NEWSLETTER_TEMPLATE_ID ?? "",
      contact: process.env.MAILERSEND_CONTACT_TEMPLATE_ID ?? "",
    });
    return NextResponse.json({ message: "Email enviado com sucesso" }, { status: 200 });
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    return NextResponse.json({ error: "Erro ao enviar email" }, { status: 500 });
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run app/api/mail/route.test.ts`
Expected: PASS (4 cases).

- [ ] **Step 5: Commit**

```bash
git add app/api/mail/route.ts app/api/mail/route.test.ts
git commit -m "feat: /api/mail route handler with validation + key guard"
```

---

## Task 4: `.env.example` + local env

**Files:**
- Create: `.env.example`

- [ ] **Step 1: Create the example env file**

Create `.env.example`:
```
# MailerSend — reuse the values from the current app (div-tecnologia)
MAILERSEND_API_KEY=
MAILERSEND_NEWSLETTER_TEMPLATE_ID=
MAILERSEND_CONTACT_TEMPLATE_ID=
```

- [ ] **Step 2: Create a local `.env.local` with real values (not committed)**

Run (paste the real values from `../div-tecnologia/.env.local`):
```bash
cp .env.example .env.local
# then edit .env.local and fill in the three values
```
Expected: `.env.local` exists and is already ignored by `.gitignore` (Next default).

- [ ] **Step 3: Commit the example only**

```bash
git add .env.example
git commit -m "chore: document MailerSend env vars (.env.example)"
```

---

## Task 5: PT/EN feedback strings

**Files:**
- Modify: `app/content.ts`

- [ ] **Step 1: Append a `feedback` section**

Add to the end of `app/content.ts`:
```ts
/* ============================================================
   Feedback (toasts + form validation) — PT/EN
   ============================================================ */
export const feedback = {
  newsletterSuccess: { pt: "Inscrição enviada com sucesso!", en: "Subscription sent!" },
  newsletterError: { pt: "Erro ao enviar. Tente novamente.", en: "Failed to send. Try again." },
  contactSuccess: {
    pt: "Obrigado pelo contato! Em breve retornaremos.",
    en: "Thanks for reaching out! We'll get back soon.",
  },
  contactError: { pt: "Erro ao enviar. Tente novamente.", en: "Failed to send. Try again." },
  invalidEmail: { pt: "E-mail inválido", en: "Invalid email" },
  required: { pt: "Campo obrigatório", en: "Required field" },
  sending: { pt: "Enviando…", en: "Sending…" },
};
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/content.ts
git commit -m "feat: PT/EN feedback strings for forms"
```

---

## Task 6: `useMailer` client hook

**Files:**
- Create: `app/hooks/useMailer.ts`

- [ ] **Step 1: Write the hook**

Create `app/hooks/useMailer.ts`:
```ts
"use client";

import useSWRMutation from "swr/mutation";
import type { ContactFormValues } from "../lib/mail-schema";

type NewsletterPayload = { template: "newsletter"; email: string };
type ContactPayload = { template: "contact" } & ContactFormValues;
type MailArg = NewsletterPayload | ContactPayload;

async function sendRequest(url: string, { arg }: { arg: MailArg }) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  });
  if (!res.ok) throw new Error("Erro ao enviar email");
  return res.json();
}

export function useMailer() {
  const { trigger, isMutating, error } = useSWRMutation("/api/mail", sendRequest);

  const sendNewsletter = (email: string) => trigger({ template: "newsletter", email });
  const sendContact = (data: ContactFormValues) => trigger({ template: "contact", ...data });

  return { sendNewsletter, sendContact, isLoading: isMutating, error };
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/hooks/useMailer.ts
git commit -m "feat: useMailer SWR hook (newsletter + contact)"
```

---

## Task 7: Mount the sonner Toaster

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Import and render `<Toaster/>`**

In `app/layout.tsx`, add the import near the top:
```tsx
import { Toaster } from "sonner";
```
Then render it inside `<LangProvider>`, right after `<RouteMotion />`:
```tsx
          <RouteMotion />
          <Toaster theme="dark" position="bottom-right" richColors closeButton />
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: build succeeds; routes still listed (`/`, `/contato`, `/servicos`, `/sobre`) and `/api/mail` appears as a route (`ƒ` dynamic).

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: mount sonner Toaster (dark)"
```

---

## Task 8: Newsletter form (Footer) — real submit

**Files:**
- Modify: `app/components/Footer.tsx`

- [ ] **Step 1: Replace the fake-submit newsletter with RHF + useMailer**

In `app/components/Footer.tsx`:
- Add imports:
```tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { feedback } from "../content";
import { newsletterFormSchema, type NewsletterFormValues } from "../lib/mail-schema";
import { useMailer } from "../hooks/useMailer";
```
- Remove the old `useState`/`onNewsletter`/`sent` logic.
- Inside the component, add:
```tsx
  const { sendNewsletter, isLoading } = useMailer();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterFormValues>({ resolver: zodResolver(newsletterFormSchema) });

  const onNewsletter = handleSubmit(async ({ email }) => {
    try {
      await sendNewsletter(email);
      toast.success(t(feedback.newsletterSuccess));
      reset();
    } catch {
      toast.error(t(feedback.newsletterError));
    }
  });
```
- Replace the `<form className="news" ...>` block with:
```tsx
              <form className="news" onSubmit={onNewsletter} noValidate>
                <input
                  type="email"
                  autoComplete="email"
                  aria-label={t(footer.emailPlaceholder)}
                  placeholder={t(footer.emailPlaceholder)}
                  {...register("email")}
                />
                <button type="submit" aria-label="Subscribe" disabled={isLoading}>
                  {isLoading ? "…" : "↗"}
                </button>
              </form>
              {errors.email && (
                <p style={{ color: "#ff6b6b", fontSize: 12, marginTop: 6 }}>
                  {t(feedback.invalidEmail)}
                </p>
              )}
```
(The `sent` state and its button styling are gone; success is now a toast.)

- [ ] **Step 2: Verify build + type-check**

Run: `npm run build`
Expected: success, no type errors.

- [ ] **Step 3: Manual browser check**

Run `PORT=3939 npm run start`, open `http://localhost:3939/`, scroll to footer.
- Submit empty/invalid email → inline "E-mail inválido", no request.
- Submit `a@b.com` → without a real key, error toast appears (route returns 500); with a real key in `.env.local`, success toast + field clears.
Expected: validation + toast behavior as described; no console errors.

- [ ] **Step 4: Commit**

```bash
git add app/components/Footer.tsx
git commit -m "feat: wire newsletter form to /api/mail (RHF + zod + toast)"
```

---

## Task 9: Contact form (ContatoView) — real submit + controlled chips

**Files:**
- Modify: `app/components/ContatoView.tsx`

- [ ] **Step 1: Replace local state with RHF + useMailer; chips drive `services[]`**

In `app/components/ContatoView.tsx`:
- Add imports:
```tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { feedback } from "../content";
import { contactFormSchema, type ContactFormValues } from "../lib/mail-schema";
import { useMailer } from "../hooks/useMailer";
```
- Remove `selected`/`sent`/`toggleChip`/`onSubmit` `useState` logic.
- Add:
```tsx
  const { sendContact, isLoading } = useMailer();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", email: "", company: "", services: [], message: "" },
  });
  const services = watch("services");

  const toggleChip = (label: string) => {
    const next = services.includes(label)
      ? services.filter((s) => s !== label)
      : [...services, label];
    setValue("services", next, { shouldValidate: false });
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      await sendContact(data);
      toast.success(t(feedback.contactSuccess));
      reset();
    } catch {
      toast.error(t(feedback.contactError));
    }
  });
```
- Change the `<form ... onSubmit={onSubmit} noValidate>`.
- Register inputs (keep existing classes/labels/ids). Example for the name field:
```tsx
                <input id="ct-name" type="text" autoComplete="name"
                  placeholder={t(c.form.namePlaceholder)} {...register("name")} />
                {errors.name && <p style={{ color: "#ff6b6b", fontSize: 12 }}>{t(feedback.required)}</p>}
```
Apply the same pattern: `{...register("company")}` (id `ct-company`), `{...register("email")}` (id `ct-email`, error → `t(feedback.invalidEmail)`), `{...register("message")}` on the `<textarea>` (id `ct-more`, error → `t(feedback.required)`).
- Chips use the form-derived `services`:
```tsx
                  {c.form.chips.map((chip, i) => {
                    const label = t(chip);
                    const on = services.includes(label);
                    return (
                      <span key={i} className={on ? "chip on" : "chip"}
                        onClick={() => toggleChip(label)}>
                        {label}
                      </span>
                    );
                  })}
```
- Submit button uses `isLoading`:
```tsx
              <button type="submit" className="btn" data-magnet disabled={isLoading}
                style={{ marginTop: 8 }}>
                <span>{isLoading ? t(feedback.sending) : t(c.form.submit)}</span>
                <span className="arw">↗</span>
              </button>
```
(The fake `sent` styling is removed; success is a toast.)

> Note: chip labels are stored as the **current-language** display string. Acceptable since the email is composed server-side from the submitted values; if a stable key is preferred later, store `chip.pt` instead.

- [ ] **Step 2: Verify build + type-check**

Run: `npm run build`
Expected: success, no type errors.

- [ ] **Step 3: Manual browser check**

Open `http://localhost:3939/contato`.
- Submit empty → inline errors on name/email/message; no request.
- Toggle chips → `on` class toggles (controlled by form state).
- Fill name/email/message, pick chips, submit → error toast without key / success toast + form reset with key. Confirm `/api/mail` returns 200 in the Network panel.
Expected: behaves as described; no console errors/hydration warnings.

- [ ] **Step 4: Commit**

```bash
git add app/components/ContatoView.tsx
git commit -m "feat: wire contact form to /api/mail with controlled service chips"
```

---

## Task 10: README — Newsletter & Contato + deploy/replacement

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add a section**

Append to `README.md`:
```markdown
## Newsletter & Contato (MailerSend)

`POST /api/mail` (server route) sends through MailerSend, mirroring the previous app:
- `{ template: 'newsletter', email }` → welcome email.
- `{ template: 'contact', name, email, company?, services?: string[], message }` →
  confirmation to the user + BCC to `contato@divtecnologia.com.br`. Selected
  services are folded into the message and sent as personalization data.

### Env vars (copy from the current app)
```
MAILERSEND_API_KEY=
MAILERSEND_NEWSLETTER_TEMPLATE_ID=
MAILERSEND_CONTACT_TEMPLATE_ID=
```
Local: `cp .env.example .env.local` and fill in. Vercel: set the same three vars
in the project that serves the domain.

### Replacing the current site (`isaacviannadev/div-tecnologia`)
1. Point this repo at the existing remote (or copy these files into it).
2. Set the 3 MailerSend env vars on the host.
3. Deploy. `/api/mail` runs on the Node runtime; pages stay static.

> MailerSend template note: the contact template may still reference `{{phone}}`/
> `{{budget}}`. The composed message already includes the services, so emails
> render correctly; simplify the template to `{{name}}/{{email}}/{{company}}/
> {{services}}/{{message}}` when convenient.

> Follow-up (out of scope): add a honeypot + simple rate-limit to `/api/mail`.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: newsletter/contato + deploy & replacement notes"
```

---

## Task 11: Full verification

- [ ] **Step 1: Run the unit suite**

Run: `npm test`
Expected: all schema/service/route tests pass.

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: success; `/api/mail` listed as dynamic (`ƒ`), the four pages static (`○`).

- [ ] **Step 3: Browser smoke (both forms)**

Run `PORT=3939 npm run start`; verify newsletter (home footer) and contact (`/contato`) per Tasks 8/9, in both PT and EN (toggle), and confirm the console is clean (no errors/hydration warnings). Without a real key the error-toast path is expected; with a real key in `.env.local`, confirm success toasts and a 200 from `/api/mail`.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "test: verify newsletter/contato end-to-end"
```

---

## Self-Review notes

- **Spec coverage:** API contract (Task 3), service-composed message + personalization (Task 2), schemas/validation (Task 1), useMailer (Task 6), newsletter form (Task 8), contact form with controlled chips (Task 9), Toaster (Task 7), PT/EN strings (Task 5), env/.env.example (Task 4), README/deploy (Task 10), verification (Task 11). All spec sections mapped.
- **Types:** `MailPayload`, `ContactFormValues`, `NewsletterFormValues`, `MailClient`, `useMailer().{sendNewsletter,sendContact,isLoading}` are consistent across tasks.
- **No placeholders:** every code step shows real code; UI verification steps give concrete expected outcomes.
- **Known tradeoff (documented):** chip labels stored as current-language strings; acceptable because the email is built from submitted values.
