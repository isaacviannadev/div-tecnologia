import Image from 'next/image'
import { Border } from '../Border'
import { Container } from '../Container'
import { FadeIn, FadeInStagger } from '../FadeIn'

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

export default function Clients() {
  return (
    <Container className="mt-24 sm:mt-32 lg:mt-40">
      <FadeIn>
        <h2 className="font-display text-2xl font-semibold text-neutral-950">
          You’re in good company
        </h2>
      </FadeIn>
      <FadeInStagger className="mt-10" faster>
        <Border as={FadeIn} />
        <ul className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
          {clients.map(([client, logo]) => (
            <li key={client} className="group">
              <FadeIn className="overflow-hidden">
                <Border className="pt-12 group-[&:nth-child(-n+2)]:-mt-px sm:group-[&:nth-child(3)]:-mt-px lg:group-[&:nth-child(4)]:-mt-px">
                  <Image
                    src={logo}
                    alt={client}
                    unoptimized
                    className="invert"
                  />
                </Border>
              </FadeIn>
            </li>
          ))}
        </ul>
      </FadeInStagger>
    </Container>
  )
}
