import { type Metadata } from 'next'
import { useTranslations } from 'next-intl'

import ContactForm from '@div/components/ContactForm'
import ContactDetails from '@div/components/ContactForm/contact-details'
import { Container } from '@div/components/Container'
import { PageIntro } from '@div/components/PageIntro'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Let’s work together. We can’t wait to hear from you.',
}

export default function Contact() {
  const t = useTranslations('Contact')

  return (
    <>
      <PageIntro eyebrow={t('eyebrow')} title={t('title')}>
        <p>{t('subtitle')}</p>
      </PageIntro>

      <Container className="mt-24 sm:mt-32 lg:mt-40">
        <div className="grid grid-cols-1 gap-x-8 gap-y-24 lg:grid-cols-2">
          <ContactForm />
          <ContactDetails />
        </div>
      </Container>
    </>
  )
}
