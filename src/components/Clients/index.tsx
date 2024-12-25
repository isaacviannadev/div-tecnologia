import { useTranslations } from 'next-intl'
import Image from 'next/image'

import { Container } from '@div/components/Container'
import { FadeIn, FadeInStagger } from '@div/components/FadeIn'
import {
  cartier,
  farfetch,
  ferragamo,
  hurb,
  mgm,
  qconcursos,
  wella,
  worten,
} from '@div/images/brands'

const clients = [
  ['Wella', wella],
  ['Worten', worten],
  ['Farfetch', farfetch],
  ['Ferragamo', ferragamo],
  ['Hurb', hurb],
  ['MGM Resorts', mgm],
  ['Qconcursos', qconcursos],
  ['Cartier', cartier],
]

function Clients() {
  const t = useTranslations('Clients')

  return (
    <div className="mt-24 rounded-4xl bg-neutral-950 py-20 sm:mt-32 sm:py-32 lg:mt-56">
      <Container>
        <FadeIn className="flex items-center gap-x-8">
          <h2 className="text-center font-display text-sm font-semibold tracking-wider text-white sm:text-left">
            {t('title')}
          </h2>
          <div className="h-px flex-auto bg-neutral-800" />
        </FadeIn>
        <FadeInStagger faster>
          <ul className="mt-10 grid grid-cols-2 gap-x-8 gap-y-14 lg:grid-cols-4">
            {clients.map(([client, logo]) => (
              <li key={client} className="place-content-center">
                <FadeIn>
                  <Image
                    className="h-auto w-48 text-white"
                    src={logo}
                    alt={client}
                    unoptimized
                  />
                </FadeIn>
              </li>
            ))}
          </ul>
        </FadeInStagger>
      </Container>
    </div>
  )
}

export { Clients }
