import type { MailPayload } from "./mail-schema";

const FROM = "DIV Tecnologia <contato@divtecnologia.com.br>";
const DIV_INBOX = "contato@divtecnologia.com.br";

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

const SHELL = (inner: string) =>
  `<div style="font-family:ui-sans-serif,system-ui,Arial,sans-serif;background:#08080a;color:#f4f3ee;padding:32px">
     <div style="max-width:560px;margin:0 auto">
       <div style="font-weight:800;letter-spacing:-0.02em;font-size:22px;color:#f4f3ee">DIV<span style="color:#F4A13F">.</span></div>
       <div style="height:1px;background:rgba(244,243,238,0.15);margin:20px 0"></div>
       ${inner}
       <div style="height:1px;background:rgba(244,243,238,0.15);margin:24px 0"></div>
       <div style="font-size:12px;color:rgba(244,243,238,0.5)">DIV Tecnologia · Design Systems &amp; Front-end Performance</div>
     </div>
   </div>`;

function newsletterHtml(): string {
  return SHELL(
    `<h1 style="font-size:24px;margin:0 0 12px">Inscrição confirmada 🎉</h1>
     <p style="color:rgba(244,243,238,0.7);line-height:1.6;margin:0">
       Você vai receber nossas notas sobre design systems, performance e IA
       aplicada ao front-end. Sem ruído — só o que importa.
     </p>`,
  );
}

function contactHtml(payload: Extract<MailPayload, { template: "contact" }>): string {
  const message = buildContactMessage(payload.message, payload.services);
  const row = (label: string, value: string) =>
    `<tr>
       <td style="padding:6px 0;color:rgba(244,243,238,0.5);font-size:13px;width:120px;vertical-align:top">${label}</td>
       <td style="padding:6px 0;color:#f4f3ee;font-size:14px;line-height:1.5">${value}</td>
     </tr>`;
  return SHELL(
    `<h1 style="font-size:22px;margin:0 0 16px">Novo contato pelo site</h1>
     <table style="width:100%;border-collapse:collapse">
       ${row("Nome", esc(payload.name))}
       ${row("E-mail", esc(payload.email))}
       ${payload.company ? row("Empresa", esc(payload.company)) : ""}
       ${payload.services.length ? row("Serviços", esc(payload.services.join(", "))) : ""}
       ${row("Mensagem", esc(message).replace(/\n/g, "<br>"))}
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
