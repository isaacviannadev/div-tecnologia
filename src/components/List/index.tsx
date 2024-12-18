import clsx from 'clsx';

import { FadeInStagger } from '@div/components/FadeIn';

type ListProps = React.HTMLAttributes<HTMLUListElement>;

export function List({ className, children }: ListProps) {
  return (
    <FadeInStagger>
      <ul className={clsx('text-base text-neutral-600', className)}>
        {children}
      </ul>
    </FadeInStagger>
  );
}
