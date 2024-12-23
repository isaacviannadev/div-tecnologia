import clsx from 'clsx';
import Image from 'next/image';
import { BlockquoteProps } from '.';

type BlockquoteWithImageProps = BlockquoteProps & {
  image: string;
};

export default function BlockquoteWithImageProps({
  author,
  image,
  children,
  className,
}: BlockquoteProps) {
  return (
    <figure
      className={clsx(
        'grid grid-cols-[auto,1fr] items-center gap-x-4 gap-y-8 sm:grid-cols-12 sm:grid-rows-[1fr,auto,auto,1fr] sm:gap-x-10 lg:gap-x-16',
        className
      )}
    >
      <blockquote className='col-span-2 text-xl/7 text-neutral-600 sm:col-span-7 sm:col-start-6 sm:row-start-2'>
        {typeof children === 'string' ? <p>{children}</p> : children}
      </blockquote>
      <div className='col-start-1 row-start-2 overflow-hidden rounded-xl bg-neutral-100 sm:col-span-5 sm:row-span-full sm:rounded-3xl'>
        <Image
          alt=''
          src={image ?? ''}
          sizes='(min-width: 1024px) 17.625rem, (min-width: 768px) 16rem, (min-width: 640px) 40vw, 3rem'
          width={300}
          height={400}
          className='h-12 w-12 object-cover grayscale sm:aspect-[7/9] sm:h-auto sm:w-full'
        />
      </div>
      <figcaption className='text-sm text-neutral-950 sm:col-span-7 sm:row-start-3 sm:text-base'>
        <span className='font-semibold'>{author.name}</span>
        <span className='hidden font-semibold sm:inline'>, </span>
        <br className='sm:hidden' />
        <span className='sm:font-semibold'>{author.role}</span>
      </figcaption>
    </figure>
  );
}
