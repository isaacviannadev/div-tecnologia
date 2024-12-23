import clsx from 'clsx';
import { BlockquoteProps } from '.';
import { Border } from '../Border';

export default function BlockquoteWithoutImage({
  author,
  children,
  className,
}: BlockquoteProps) {
  return (
    <Border position='left' className={clsx('pl-8', className)}>
      <figure className='text-sm'>
        <blockquote className="text-neutral-600 [&>*]:relative [&>:first-child]:before:absolute [&>:first-child]:before:right-full [&>:first-child]:before:content-['“'] [&>:last-child]:after:content-['”']">
          {typeof children === 'string' ? <p>{children}</p> : children}
        </blockquote>
        <figcaption className='mt-6 font-semibold text-neutral-950'>
          {author.name}, {author.role}
        </figcaption>
      </figure>
    </Border>
  );
}
