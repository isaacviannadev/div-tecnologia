import type { MailPayload } from "./mail-schema";

const FROM = "DIV Tecnologia <contato@divtecnologia.com.br>";
const DIV_INBOX = "contato@divtecnologia.com.br";
const SITE = "https://www.divtecnologia.com.br";
const LOGO_URL = `${SITE}/brand/div-logo.png`;

/** Minimal structural shape of the Resend client we use — lets tests inject a
    fake. The real `Resend` instance is assignable to this. */
export type MailClient = {
  emails: {
    send: (opts: {
      from: string;
      to: string | string[];
      replyTo?: string;
      subject: string;
      html: string;
    }) => Promise<{ data: unknown; error: unknown }>;
  };
};

/** Fold the selected service chips into the message body. */
export function buildContactMessage(message: string, services: string[]): string {
  if (!services.length) return message;
  return `${message}\n\nServiços de interesse: ${services.join(", ")}`;
}

/** Escape user-provided text before interpolating into HTML emails. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* Table-based shell for broad email-client support (Gmail-safe). Dark "ink"
   card, brand-orange accent bar, real DIV logo (hosted PNG), refined footer. */
const SHELL = (inner: string) => `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0;padding:0;background:#08080a;">
  <tr>
    <td align="center" style="padding:40px 16px;">
      <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="width:100%;max-width:520px;background:#0f0f12;border:1px solid rgba(244,243,238,0.12);border-radius:16px;overflow:hidden;font-family:ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif;">
        <tr><td style="height:3px;line-height:3px;font-size:0;background:#F4A13F;">&nbsp;</td></tr>
        <tr>
          <td style="padding:36px 40px 0;">
            <img src="${LOGO_URL}" alt="DIV Tecnologia" width="92" height="26" style="display:block;width:92px;height:auto;border:0;outline:none;text-decoration:none;" />
          </td>
        </tr>
        <tr><td style="padding:28px 40px 36px;">${inner}</td></tr>
        <tr>
          <td style="padding:22px 40px;border-top:1px solid rgba(244,243,238,0.1);">
            <p style="margin:0;font-size:12px;line-height:1.7;color:rgba(244,243,238,0.45);">
              DIV Tecnologia · Design Systems &amp; Front-end Performance<br />
              <a href="${SITE}" style="color:#F4A13F;text-decoration:none;">divtecnologia.com.br</a>
              &nbsp;·&nbsp; RJ · BR / Leiria · PT
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;

const H1 =
  "margin:0 0 14px;font-size:26px;line-height:1.15;font-weight:800;letter-spacing:-0.02em;color:#f4f3ee;";
const P =
  "margin:0 0 18px;font-size:15px;line-height:1.65;color:rgba(244,243,238,0.72);";
const STRONG = "color:#f4f3ee;font-weight:600;";
const BTN =
  "display:inline-block;background:#F4A13F;color:#0a0a0a;font-size:14px;font-weight:700;letter-spacing:0.01em;text-decoration:none;padding:13px 22px;border-radius:9px;";

function newsletterHtml(): string {
  return SHELL(
    `<h1 style="${H1}">Inscrição confirmada</h1>
     <p style="${P}">Você está na lista. Vamos enviar notas sobre
       <strong style="${STRONG}">design systems</strong>,
       <strong style="${STRONG}">performance</strong> e
       <strong style="${STRONG}">IA aplicada ao front-end</strong> — sem ruído, só o que importa.</p>
     <a href="${SITE}" style="${BTN}">Conhecer a DIV →</a>`,
  );
}

function contactHtml(payload: Extract<MailPayload, { template: "contact" }>): string {
  const message = buildContactMessage(payload.message, payload.services);
  const row = (label: string, value: string) =>
    `<tr>
       <td style="padding:11px 0;border-bottom:1px solid rgba(244,243,238,0.08);color:rgba(244,243,238,0.45);font-size:11px;text-transform:uppercase;letter-spacing:0.07em;width:108px;vertical-align:top;">${label}</td>
       <td style="padding:11px 0;border-bottom:1px solid rgba(244,243,238,0.08);color:#f4f3ee;font-size:14px;line-height:1.55;">${value}</td>
     </tr>`;
  return SHELL(
    `<h1 style="${H1}">Novo contato pelo site</h1>
     <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
       ${row("Nome", esc(payload.name))}
       ${row("E-mail", `<a href="mailto:${esc(payload.email)}" style="color:#F4A13F;text-decoration:none;">${esc(payload.email)}</a>`)}
       ${payload.company ? row("Empresa", esc(payload.company)) : ""}
       ${payload.services.length ? row("Serviços", esc(payload.services.join(", "))) : ""}
       ${row("Mensagem", esc(message).replace(/\n/g, "<br />"))}
     </table>`,
  );
}

function errorMessage(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "Resend error";
}

export async function sendMail(
  client: MailClient,
  payload: MailPayload,
): Promise<void> {
  if (payload.template === "newsletter") {
    const { error } = await client.emails.send({
      from: FROM,
      to: payload.email,
      subject: "Bem-vindo à newsletter da DIV Tecnologia",
      html: newsletterHtml(),
    });
    if (error) throw new Error(errorMessage(error));
    return;
  }

  // Contact submissions notify the DIV inbox, with Reply-To set to the person
  // who filled the form so the team can reply to them directly.
  const { error } = await client.emails.send({
    from: FROM,
    to: DIV_INBOX,
    replyTo: payload.email,
    subject: `Novo contato pelo site — ${payload.name}`,
    html: contactHtml(payload),
  });
  if (error) throw new Error(errorMessage(error));
}
