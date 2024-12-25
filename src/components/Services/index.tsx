import { useTranslations } from 'next-intl'

import { Container } from '@div/components/Container'
import { FadeIn } from '@div/components/FadeIn'
import { List } from '@div/components/List'
import { ListItem } from '@div/components/List/list-item'
import { SectionIntro } from '@div/components/SectionIntro'
import { StylizedImage } from '@div/components/StylizedImage'

import imageLaptop from '@div/images/laptop.jpg'

export function Services() {
  const t = useTranslations('Services')

  return (
    <>
      <SectionIntro
        eyebrow={t('eyebrow')}
        title={t('title')}
        className="mt-24 sm:mt-32 lg:mt-40"
      >
        {t('subtitle')}
      </SectionIntro>
      <Container className="mt-16">
        <div className="lg:flex lg:items-center lg:justify-end">
          <div className="flex justify-center lg:w-1/2 lg:justify-end lg:pr-12">
            <FadeIn className="w-[33.75rem] flex-none lg:w-[45rem]">
              <StylizedImage
                src={imageLaptop}
                alt="Laptop"
                sizes="(min-width: 1024px) 41rem, 31rem"
                className="justify-center lg:justify-end"
              />
            </FadeIn>
          </div>
          <List className="mt-16 lg:mt-0 lg:w-1/2 lg:min-w-[33rem] lg:pl-4">
            <ListItem title={t('items.webDevelopment.title')}>
              {t('items.webDevelopment.description')}
            </ListItem>
            <ListItem title={t('items.mobileDevelopment.title')}>
              {t('items.mobileDevelopment.description')}
            </ListItem>
            <ListItem title={t('items.ecommerce.title')}>
              {t('items.ecommerce.description')}
            </ListItem>
            <ListItem title={t('items.consulting.title')}>
              {t('items.consulting.description')}
            </ListItem>
          </List>
        </div>
      </Container>
    </>
  )
}
