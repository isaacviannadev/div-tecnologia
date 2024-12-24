import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Border } from '../Border'
import { FadeIn } from '../FadeIn'
import { Offices } from '../Offices'
import { SocialMedia } from '../SocialMedia'

export default function ContactDetails() {
  const t = useTranslations('Contact')

  return (
    <FadeIn>
      <h2 className="font-display text-base font-semibold text-neutral-950">
        {t('details.ourOffices')}
      </h2>
      <p className="mt-6 text-base text-neutral-600">
        {t('details.officeDescription')}
      </p>

      <Offices className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2" />

      <Border className="mt-16 pt-16">
        <h2 className="font-display text-base font-semibold text-neutral-950">
          {t('details.emailUs')}
        </h2>
        <dl className="mt-6 grid grid-cols-1 gap-8 text-sm sm:grid-cols-2">
          {[
            [t('details.emailContato'), 'contato@divtecnologia.com.br'],
            // ['Press', 'press@divtecnologia.com.br'],
          ].map(([label, email]) => (
            <div key={email}>
              <dt className="font-semibold text-neutral-950">{label}</dt>
              <dd>
                <Link
                  href={`mailto:${email}`}
                  className="text-neutral-600 hover:text-neutral-950"
                >
                  {email}
                </Link>
              </dd>
            </div>
          ))}
        </dl>
      </Border>

      <Border className="mt-16 pt-16">
        <h2 className="font-display text-base font-semibold text-neutral-950">
          {t('details.followUs')}
        </h2>
        <SocialMedia className="mt-6" />
      </Border>
    </FadeIn>
  )
}
