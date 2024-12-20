import Link from 'next/link';

import { Container } from '@div/components/Container';
import { FadeIn } from '@div/components/FadeIn';
import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('NotFound');

  return (
    <Container className='flex h-full items-center pt-24 sm:pt-32 lg:pt-40'>
      <FadeIn className='flex flex-col items-center'>
        <p className='font-display text-4xl font-semibold text-neutral-950 sm:text-5xl'>
          {t('title')}
        </p>
        <h1 className='mt-4 font-display text-2xl font-semibold text-neutral-950'>
          {t('subtitle')}
        </h1>
        <p className='mt-2 text-sm text-neutral-600'>{t('description')}</p>
        <Link
          href='/'
          className='mt-4 text-sm font-semibold text-neutral-950 transition hover:text-neutral-700'
        >
          {t('backToHome')}
        </Link>
      </FadeIn>
    </Container>
  );
}
