import { useTranslations } from 'next-intl'
import Image from 'next/image'

import { Container } from '@div/components/Container'
import { FadeIn, FadeInStagger } from '@div/components/FadeIn'
import {
  adentis,
  cartier,
  crowd,
  farfetch,
  ferragamo,
  ferrari,
  hurb,
  lilly,
  netlinks,
  qconcursos,
  sana,
  wella,
  worten,
  zeloclub,
} from '@div/images/brands'

const clients = [
  ['Ferrari', ferrari],
  ['Zelo Club', zeloclub],
  ['Wella', wella],
  ['Cartier', cartier],
  ['Worten', worten],
  ['Farfetch', farfetch],
  ['Ferragamo', ferragamo],
  ['Sana', sana],
]

const minorClients = [
  // ['MGM Resorts', mgm],
  ['Hurb', hurb],
  ['Qconcursos', qconcursos],
  ['Adentis', adentis],
  ['Crowd', crowd],
  ['Netlinks', netlinks],
  ['Lilly', lilly],
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
                <FadeIn className="flex items-center justify-center">
                  <Image
                    className="h-auto max-h-24 w-36 text-white"
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

      <Container>
        <FadeInStagger faster>
          <ul className="mt-20 grid grid-cols-3 gap-x-8 gap-y-14 lg:grid-cols-7">
            {minorClients.map(([client, logo]) => (
              <li key={client} className="place-content-center">
                <FadeIn className="flex items-center justify-center">
                  <Image
                    className="h-auto max-h-12 w-20 text-white"
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
