import { useTranslations } from 'next-intl';

import { Clients } from '@div/components/Clients';
import { Container } from '@div/components/Container';
import { FadeIn } from '@div/components/FadeIn';
import { Services } from '@div/components/Services';
import { Testimonial } from '@div/components/Testimonial';

import { ContactSection } from '@div/components/ContactSection';
import { cartierColor } from '@div/images/brands';

export default function Home() {
  const t = useTranslations();

  return (
    <>
      <Container className='mt-24 sm:mt-32 md:mt-56'>
        <FadeIn className='max-w-3xl'>
          <h1 className='font-display text-5xl font-medium tracking-tight text-neutral-950 [text-wrap:balance] sm:text-7xl'>
            {t('HomePage.title')}
          </h1>
          <p className='text mt-6 text-xl text-neutral-600'>
            {t('HomePage.subtitle')}
          </p>
        </FadeIn>
      </Container>
      <Clients />

      <Testimonial
        className='mt-24 sm:mt-32 lg:mt-40'
        client={{ name: 'Cartier', logo: cartierColor }}
      >
        {t('Clients.Testimonials.cartier.quote')}
      </Testimonial>

      <Services />

      <ContactSection />
    </>
  );
}
