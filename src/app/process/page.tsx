import { type Metadata } from 'next'

import { Blockquote } from '@div/components/Blockquote'
import { ContactSection } from '@div/components/ContactSection'
import { Container } from '@div/components/Container'
import { FadeIn } from '@div/components/FadeIn'
import { GridList, GridListItem } from '@div/components/GridList'
import { GridPattern } from '@div/components/GridPattern'
import { List } from '@div/components/List'
import { ListItem } from '@div/components/List/list-item'
import { PageIntro } from '@div/components/PageIntro'
import { SectionIntro } from '@div/components/SectionIntro'
import { StylizedImage } from '@div/components/StylizedImage'
import { TagList, TagListItem } from '@div/components/TagList'
import imageLaptop from '@div/images/laptop.jpg'
import imageMeeting from '@div/images/meeting.jpg'
import imageWhiteboard from '@div/images/whiteboard.jpg'
import { useTranslations } from 'next-intl'

function Section({
  title,
  image,
  children,
}: {
  title: string
  image: React.ComponentPropsWithoutRef<typeof StylizedImage>
  children: React.ReactNode
}) {
  return (
    <Container className="group/section [counter-increment:section]">
      <div className="lg:flex lg:items-center lg:justify-end lg:gap-x-8 lg:group-even/section:justify-start xl:gap-x-20">
        <div className="flex justify-center">
          <FadeIn className="w-[33.75rem] flex-none lg:w-[45rem]">
            <StylizedImage
              {...image}
              sizes="(min-width: 1024px) 41rem, 31rem"
              className="justify-center lg:justify-end lg:group-even/section:justify-start"
            />
          </FadeIn>
        </div>
        <div className="mt-12 lg:mt-0 lg:w-[37rem] lg:flex-none lg:group-even/section:order-first">
          <FadeIn>
            <div
              className="font-display text-base font-semibold before:text-neutral-300 before:content-['/_'] after:text-neutral-950 after:content-[counter(section,decimal-leading-zero)]"
              aria-hidden="true"
            />
            <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-neutral-950 sm:text-4xl">
              {title}
            </h2>
            <div className="mt-6">{children}</div>
          </FadeIn>
        </div>
      </div>
    </Container>
  )
}

function Discover() {
  const t = useTranslations('Process')

  return (
    <Section
      title={t('discover.title')}
      image={{ src: imageWhiteboard, alt: 'Whiteboard' }}
    >
      <div className="space-y-6 text-base text-neutral-600">
        <p>
          {t.rich('discover.paragraph1', {
            strong: (children) => (
              <strong className="font-semibold text-neutral-950">
                {children}
              </strong>
            ),
          })}
        </p>
        <p>
          {t.rich('discover.paragraph2', {
            strong: (children) => (
              <strong className="font-semibold text-neutral-950">
                {children}
              </strong>
            ),
          })}
        </p>
        <p>
          {t.rich('discover.paragraph3', {
            strong: (children) => (
              <strong className="font-semibold text-neutral-950">
                {children}
              </strong>
            ),
          })}
        </p>
      </div>

      <h3 className="mt-12 font-display text-base font-semibold text-neutral-950">
        {t('discover.included')}
      </h3>
      <TagList className="mt-4">
        <TagListItem> {t('discover.tags.tag1')}</TagListItem>
        <TagListItem> {t('discover.tags.tag2')}</TagListItem>
        <TagListItem> {t('discover.tags.tag3')}</TagListItem>
        <TagListItem> {t('discover.tags.tag4')}</TagListItem>
        <TagListItem> {t('discover.tags.tag5')}</TagListItem>
        <TagListItem> {t('discover.tags.tag6')}</TagListItem>
      </TagList>
    </Section>
  )
}

function Build() {
  const t = useTranslations('Process')

  return (
    <Section
      title={t('build.title')}
      image={{ src: imageLaptop, shape: 1, alt: 'Laptop' }}
    >
      <div className="space-y-6 text-base text-neutral-600">
        <p>{t('build.paragraph1')}</p>
        <p>{t('build.paragraph2')}</p>
        <p>{t('build.paragraph3')}</p>
      </div>

      <Blockquote
        author={{ name: 'Alan Marques', role: 'CTO of Hurb' }}
        className="mt-12"
      >
        <p>{t('build.blockquote')}</p>
      </Blockquote>
    </Section>
  )
}

function Deliver() {
  const t = useTranslations('Process')

  return (
    <Section
      title={t('deliver.title')}
      image={{ src: imageMeeting, shape: 2, alt: 'Meeting' }}
    >
      <div className="space-y-6 text-base text-neutral-600">
        <p>
          {t.rich('deliver.paragraph1', {
            strong: (children) => (
              <strong className="font-semibold text-neutral-950">
                {children}
              </strong>
            ),
          })}
        </p>
        <p>
          {t.rich('deliver.paragraph2', {
            strong: (children) => (
              <strong className="font-semibold text-neutral-950">
                {children}
              </strong>
            ),
          })}
        </p>
        <p>
          {t.rich('deliver.paragraph3', {
            strong: (children) => (
              <strong className="font-semibold text-neutral-950">
                {children}
              </strong>
            ),
          })}
        </p>
      </div>

      <h3 className="mt-12 font-display text-base font-semibold text-neutral-950">
        {t('deliver.included')}
      </h3>
      <List className="mt-8">
        <ListItem title={t('deliver.item1.title')}>
          {t('deliver.item1.description')}
        </ListItem>
        <ListItem title={t('deliver.item2.title')}>
          {t('deliver.item2.description')}
        </ListItem>
        <ListItem title={t('deliver.item3.title')}>
          {t('deliver.item3.description')}
        </ListItem>
      </List>
    </Section>
  )
}

function Values() {
  const t = useTranslations('Process')

  return (
    <div className="relative mt-24 pt-24 sm:mt-32 sm:pt-32 lg:mt-40 lg:pt-40">
      <div className="absolute inset-x-0 top-0 -z-10 h-[884px] overflow-hidden rounded-t-4xl bg-gradient-to-b from-neutral-50">
        <GridPattern
          className="absolute inset-0 h-full w-full fill-neutral-100 stroke-neutral-950/5 [mask-image:linear-gradient(to_bottom_left,white_40%,transparent_50%)]"
          yOffset={-270}
        />
      </div>

      <SectionIntro eyebrow={t('values.eyebrow')} title={t('values.title')}>
        <p>{t('values.subtitle')}</p>
      </SectionIntro>

      <Container className="mt-24">
        <GridList>
          <GridListItem title={t('values.items.meticulous.title')}>
            {t('values.items.meticulous.description')}
          </GridListItem>
          <GridListItem title={t('values.items.efficient.title')}>
            {t('values.items.efficient.description')}
          </GridListItem>
          <GridListItem title={t('values.items.adaptable.title')}>
            {t('values.items.adaptable.description')}
          </GridListItem>
          <GridListItem title={t('values.items.honest.title')}>
            {t('values.items.honest.description')}
          </GridListItem>
          <GridListItem title={t('values.items.loyal.title')}>
            {t('values.items.loyal.description')}
          </GridListItem>
          <GridListItem title={t('values.items.innovative.title')}>
            {t('values.items.innovative.description')}
          </GridListItem>
        </GridList>
      </Container>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Our Process',
  description:
    'We believe in efficiency and maximizing our resources to provide the best value to our clients.',
}

export default function Process() {
  const t = useTranslations('Process')

  return (
    <>
      <PageIntro eyebrow={t('eyebrow')} title={t('title')}>
        <p>{t('subtitle')}</p>
      </PageIntro>

      <div className="mt-24 space-y-24 [counter-reset:section] sm:mt-32 sm:space-y-32 lg:mt-40 lg:space-y-40">
        <Discover />
        <Build />
        <Deliver />
      </div>

      <Values />

      <ContactSection />
    </>
  )
}
