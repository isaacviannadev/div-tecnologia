import Link from 'next/link';

import { Container } from '@div/components/Container';
import { FadeIn } from '@div/components/FadeIn';
import { Logo } from '@div/components/Logo';
import { Navigation } from './navigation';
import { NewsletterForm } from './newsletter-form';

export function Footer() {
  return (
    <Container as='footer' className='mt-24 w-full sm:mt-32 lg:mt-40'>
      <FadeIn>
        <div className='grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2'>
          <Navigation />
          <div className='flex lg:justify-end'>
            <NewsletterForm />
          </div>
        </div>
        <div className='mb-20 mt-24 flex flex-wrap items-end justify-between gap-x-6 gap-y-4 border-t border-neutral-950/10 pt-12'>
          <Link href='/' aria-label='Home'>
            <Logo className='h-8' />
          </Link>
          <p className='text-sm text-neutral-700'>
            © DIV Tecnologia ltda. 2024
          </p>
        </div>
      </FadeIn>
    </Container>
  );
}
