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
