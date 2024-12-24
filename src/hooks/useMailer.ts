import useSWRMutation from 'swr/mutation'

type EmailTemplate = 'newsletter' | 'contact'

interface BaseEmailData {
  template: EmailTemplate
}

interface NewsletterEmailData extends BaseEmailData {
  template: 'newsletter'
  email: string
}

interface ContactEmailData extends BaseEmailData {
  template: 'contact'
  name: string
  email: string
  phone?: string
  company?: string
  message?: string
  budget?: string
}

type EmailData = NewsletterEmailData | ContactEmailData

async function sendRequest(url: string, { arg }: { arg: EmailData }) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(arg),
  })

  if (!response.ok) {
    throw new Error('Erro ao enviar email')
  }

  return response.json()
}

export function useMailer() {
  const { trigger, isMutating, error } = useSWRMutation(
    '/api/mail',
    sendRequest,
  )

  const sendNewsletter = async (email: string) => {
    return trigger({ template: 'newsletter', email })
  }

  const sendContactForm = async (data: Omit<ContactEmailData, 'template'>) => {
    return trigger({ template: 'contact', ...data })
  }

  return {
    sendNewsletter,
    sendContactForm,
    isLoading: isMutating,
    error,
  }
}
