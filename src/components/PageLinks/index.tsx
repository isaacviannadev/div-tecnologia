import clsx from 'clsx';
import Link from 'next/link';

import { Border } from '@div/components/Border';
import { Container } from '@div/components/Container';
import { FadeIn, FadeInStagger } from '@div/components/FadeIn';
import { GridPattern } from '@div/components/GridPattern';
import Icons from '@div/components/Icons';
import { SectionIntro } from '@div/components/SectionIntro';
import { formatDate } from '@div/lib/formatDate';

export type PageLinkProps = {
  page: {
    title: string;
    description: string;
    date: string;
    href: string;
  };
};

function PageLink({ page }: PageLinkProps) {
  return (
    <article key={page.href}>
      <Border
        position='left'
        className='relative flex flex-col items-start pl-8'
      >
        <h3 className='mt-6 text-base font-semibold text-neutral-950'>
          {page.title}
        </h3>
        <time
          dateTime={page.date}
          className='order-first text-sm text-neutral-600'
        >
          {formatDate(page.date)}
        </time>
        <p className='mt-2.5 text-base text-neutral-600'>{page.description}</p>
        <Link
          href={page.href}
          className='mt-6 flex gap-x-3 text-base font-semibold text-neutral-950 transition hover:text-neutral-700'
          aria-label={`Read more: ${page.title}`}
        >
          Read more
          <Icons.ArrowIcon2 className='w-6 flex-none fill-current' />
          <span className='absolute inset-0' />
        </Link>
      </Border>
    </article>
  );
}

export type PageLinksProps = {
  title: string;
  intro?: string;
  pages: PageLinkProps['page'][];
  className?: string;
};

export function PageLinks({ title, intro, pages, className }: PageLinksProps) {
  return (
    <div className={clsx('relative pt-24 sm:pt-32 lg:pt-40', className)}>
      <div className='absolute inset-x-0 top-0 -z-10 h-[884px] overflow-hidden rounded-t-4xl bg-gradient-to-b from-neutral-50'>
        <GridPattern
          className='absolute inset-0 h-full w-full fill-neutral-100 stroke-neutral-950/5 [mask-image:linear-gradient(to_bottom_left,white_40%,transparent_50%)]'
          yOffset={-270}
        />
      </div>

      <SectionIntro title={title} smaller>
        {intro && <p>{intro}</p>}
      </SectionIntro>

      <Container className={intro ? 'mt-24' : 'mt-16'}>
        <FadeInStagger className='grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2'>
          {pages.map((page) => (
            <FadeIn key={page.href}>
              <PageLink page={page} />
            </FadeIn>
          ))}
        </FadeInStagger>
      </Container>
    </div>
  );
}
