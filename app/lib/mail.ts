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

  // Contact submissions notify the DIV inbox (an address on the verified
  // domain — works within MailerSend trial limits). Reply-To is set to the
  // person who filled the form so the team can reply to them directly.
  const fullMessage = buildContactMessage(payload.message, payload.services);
  const params = new EmailParams()
    .setFrom(CONTACT_FROM)
    .setTo([new Recipient(SENDER_EMAIL, "DIV Tecnologia")])
    .setReplyTo(new Recipient(payload.email, payload.name))
    .setPersonalization([
      {
        email: SENDER_EMAIL,
        data: {
          name: payload.name,
          email: payload.email,
          company: payload.company,
          services: payload.services,
          message: fullMessage,
        },
      },
    ])
    .setSubject(`Novo contato pelo site — ${payload.name}`)
    .setTemplateId(templates.contact);
  await client.email.send(params);
}
