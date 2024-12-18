import { useTranslations } from 'next-intl';

import { Button } from '@div/components/Button';
import { Container } from '@div/components/Container';
import { FadeIn } from '@div/components/FadeIn';
import { Offices } from '@div/components/Offices';

export function ContactSection() {
  const t = useTranslations('ContactSection');

  return (
    <Container className='mt-24 sm:mt-32 lg:mt-40'>
      <FadeIn className='-mx-6 rounded-4xl bg-neutral-950 px-6 py-20 sm:mx-0 sm:py-32 md:px-12'>
        <div className='mx-auto max-w-4xl'>
          <div className='max-w-xl'>
            <h2 className='font-display text-3xl font-medium text-white [text-wrap:balance] sm:text-4xl'>
              {t('title')}
            </h2>
            <div className='mt-6 flex'>
              <Button href='/contact' invert>
                {t('helloBtn')}
              </Button>
            </div>
            <div className='mt-10 border-t border-white/10 pt-10'>
              <h3 className='font-display text-base font-semibold text-white'>
                {t('ourOffices')}
              </h3>
              <Offices
                invert
                className='mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2'
              />
            </div>
          </div>
        </div>
      </FadeIn>
    </Container>
  );
}
