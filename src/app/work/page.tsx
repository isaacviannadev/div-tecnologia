import { type Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { Blockquote } from '@div/components/Blockquote'
import { Border } from '@div/components/Border'
import { Button } from '@div/components/Button'
import { ContactSection } from '@div/components/ContactSection'
import { Container } from '@div/components/Container'
import { FadeIn, FadeInStagger } from '@div/components/FadeIn'
import { PageIntro } from '@div/components/PageIntro'
import { Testimonial } from '@div/components/Testimonial'
import {
  cartier,
  farfetch,
  ferragamo,
  ferrari,
  netlinks,
  sana,
  wella,
  worten,
  zeloclub,
} from '@div/images/brands'
import { formatDate } from '@div/lib/formatDate'
import { type CaseStudy, type MDXEntry, loadCaseStudies } from '@div/lib/mdx'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'

function CaseStudies({
  caseStudies,
}: {
  caseStudies: Array<MDXEntry<CaseStudy>>
}) {
  const t = useTranslations('Works')

  return (
    <Container className="mt-40">
      <FadeIn>
        <h2 className="font-display text-2xl font-semibold text-neutral-950">
          {t('caseStudies.title')}
        </h2>
      </FadeIn>
      <div className="mt-10 space-y-20 sm:space-y-24 lg:space-y-32">
        {caseStudies.map((caseStudy) => (
          <FadeIn key={caseStudy.client}>
            <article>
              <Border className="grid grid-cols-3 gap-x-8 gap-y-8 pt-16">
                <div className="col-span-full sm:flex sm:items-center sm:justify-between sm:gap-x-8 lg:col-span-1 lg:block">
                  <div className="sm:flex sm:items-center sm:gap-x-6 lg:block">
                    <Image
                      src={caseStudy.logo}
                      alt=""
                      className="h-16 w-16 flex-none"
                      unoptimized
                    />
                    <h3 className="mt-6 text-sm font-semibold text-neutral-950 sm:mt-0 lg:mt-8">
                      {caseStudy.client}
                    </h3>
                  </div>
                  <div className="mt-1 flex gap-x-4 sm:mt-0 lg:block">
                    <p className="text-sm tracking-tight text-neutral-950 after:ml-4 after:font-semibold after:text-neutral-300 after:content-['/'] lg:mt-2 lg:after:hidden">
                      {caseStudy.service}
                    </p>
                    <p className="text-sm text-neutral-950 lg:mt-2">
                      <time dateTime={caseStudy.date}>
                        {formatDate(caseStudy.date)}
                      </time>
                    </p>
                  </div>
                </div>
                <div className="col-span-full lg:col-span-2 lg:max-w-2xl">
                  <p className="font-display text-4xl font-medium text-neutral-950">
                    <Link href={caseStudy.href}>{caseStudy.title}</Link>
                  </p>
                  <div className="mt-6 space-y-6 text-base text-neutral-600">
                    {caseStudy.summary.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                  <div className="mt-8 flex">
                    <Button
                      href={caseStudy.href}
                      aria-label={`Read case study: ${caseStudy.client}`}
                    >
                      {t('caseStudies.readBtn')}
                    </Button>
                  </div>
                  {caseStudy.testimonial && (
                    <Blockquote
                      author={caseStudy.testimonial.author}
                      className="mt-12"
                    >
                      {caseStudy.testimonial.content}
                    </Blockquote>
                  )}
                </div>
              </Border>
            </article>
          </FadeIn>
        ))}
      </div>
    </Container>
  )
}

const clients = [
  ['Ferrari', ferrari],
  ['Wella', wella],
  ['Worten', worten],
  ['Cartier', cartier],
  ['Ferragamo', ferragamo],
  ['Farfetch', farfetch],
  ['Sana', sana],
  ['Zelo Club', zeloclub],
]

function Clients() {
  const t = useTranslations('Works')

  return (
    <Container className="mt-24 sm:mt-32 lg:mt-40">
      <FadeIn>
        <h2 className="font-display text-2xl font-semibold text-neutral-950">
          {t('clients.title')}
        </h2>
      </FadeIn>
      <FadeInStagger className="mt-10" faster>
        <Border as={FadeIn} />
        <ul className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
          {clients.map(([client, logo]) => (
            <li key={client} className="group">
              <FadeIn className="text overflow-hidden">
                <Border className="pt-12 group-[&:nth-child(-n+2)]:-mt-px sm:group-[&:nth-child(3)]:-mt-px lg:group-[&:nth-child(4)]:-mt-px">
                  <Image
                    src={logo}
                    alt={client}
                    unoptimized
                    className="h-auto max-h-32 w-44 invert"
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

export const metadata: Metadata = {
  title: 'Our Work',
  description:
    'We believe in efficiency and maximizing our resources to provide the best value to our clients.',
}

export default async function Work() {
  const caseStudies = await loadCaseStudies()
  const t = await getTranslations('Works')

  return (
    <>
      <PageIntro eyebrow={t('eyebrow')} title={t('title')}>
        <p>{t('subtitle')}</p>
      </PageIntro>

      <CaseStudies caseStudies={caseStudies} />

      <Testimonial
        className="mt-24 sm:mt-32 lg:mt-40"
        client={{ name: 'Israel Novaes', logo: netlinks }}
      >
        {t.rich('testimonial', {
          em: (children) => <em className="font-semibold">{children}</em>,
        })}
      </Testimonial>

      <Clients />

      <ContactSection />
    </>
  )
}
