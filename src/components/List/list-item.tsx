import { Border } from '@div/components/Border';
import { FadeIn } from '@div/components/FadeIn';

type ListItemProps = {
  title?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLLIElement>;

export function ListItem({ title, children }: ListItemProps) {
  return (
    <li className='group mt-10 first:mt-0'>
      <FadeIn>
        <Border className='pt-10 group-first:pt-0 group-first:before:hidden group-first:after:hidden'>
          {title && (
            <strong className='font-semibold text-neutral-950'>{`${title}. `}</strong>
          )}
          {children}
        </Border>
      </FadeIn>
    </li>
  );
}
