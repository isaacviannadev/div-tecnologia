import clsx from 'clsx';

type OfficeProps = {
  name: string;
  invert?: boolean;
  children: React.ReactNode;
};

function Office({ name, children, invert = false }: OfficeProps) {
  return (
    <address
      className={clsx(
        'text-sm not-italic',
        invert ? 'text-neutral-300' : 'text-neutral-600'
      )}
    >
      <strong className={invert ? 'text-white' : 'text-neutral-950'}>
        {name}
      </strong>
      <br />
      {children}
    </address>
  );
}

export default Office;
