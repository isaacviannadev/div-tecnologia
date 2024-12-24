import { EmailParams, MailerSend, Recipient, Sender } from 'mailersend'
import { NextResponse } from 'next/server'

const mailerSend = new MailerSend({
  apiKey: process.env.NEXT_PUBLIC_MAILERSEND_API_KEY ?? '',
})

const TEMPLATES = {
  newsletter: {
    templateId: process.env.NEXT_PUBLIC_MAILERSEND_NEWSLETTER_TEMPLATE_ID ?? '',
    from: new Sender(
      'contato@divtecnologia.com.br',
      'Newsletter | Div Tecnologia',
    ),
  },
  contact: {
    templateId: process.env.NEXT_PUBLIC_MAILERSEND_CONTACT_TEMPLATE_ID ?? '',
    from: new Sender(
      'contato@divtecnologia.com.br',
      'Contato | Div Tecnologia ',
    ),
  },
} as const

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { template } = body

    if (template === 'newsletter') {
      const { email } = body

      const emailParams = new EmailParams()
        .setFrom(TEMPLATES.newsletter.from)
        .setTo([new Recipient(email)])
        .setSubject('Bem vindo à newsletter da Div Tecnologia')
        .setTemplateId(TEMPLATES.newsletter.templateId)

      await mailerSend.email.send(emailParams)
    } else if (template === 'contact') {
      const { email, name, company, phone, message, budget } = body

      const bcc = [new Recipient('contato@divtecnologia.com.br')]

      const emailParams = new EmailParams()
        .setFrom(TEMPLATES.contact.from)
        .setTo([new Recipient(email, name)])
        .setBcc(bcc)
        .setPersonalization([
          { email, data: { email, name, company, phone, message, budget } },
        ])
        .setSubject('Recebemos sua mensagem, em breve retornaremos')
        .setTemplateId(TEMPLATES.contact.templateId)

      await mailerSend.email.send(emailParams)
    }

    return NextResponse.json(
      { message: 'Email enviado com sucesso' },
      { status: 200 },
    )
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return NextResponse.json({ error: 'Erro ao enviar email' }, { status: 500 })
  }
}
