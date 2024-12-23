import clsx from 'clsx';

export type TagListProps = {
  className?: string;
  children: React.ReactNode;
};

export function TagList({ className, children }: TagListProps) {
  return (
    <ul className={clsx(className, 'flex flex-wrap gap-4')}>{children}</ul>
  );
}

export function TagListItem({ className, children }: TagListProps) {
  return (
    <li
      className={clsx(
        'rounded-full bg-neutral-100 px-4 py-1.5 text-base text-neutral-600',
        className
      )}
    >
      {children}
    </li>
  );
}
