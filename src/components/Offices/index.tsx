import Office from './office';

type OfficesProps = {
  invert?: boolean;
  className?: string;
  props?: React.HTMLProps<HTMLUListElement>;
};

export function Offices({ invert = false, className, ...props }: OfficesProps) {
  return (
    <ul className={className} {...props}>
      <li>
        <Office name='Rio de Janeiro' invert={invert}>
          R. Diogo Camarão, 18 - Jd. Panamá
          <br />
          Duque de Caxias, Brazil
        </Office>
      </li>
      <li>
        <Office name='Leiria' invert={invert}>
          R. dos Vinagres, 27 - Pombal
          <br />
          Leiria, Portugal
        </Office>
      </li>
    </ul>
  );
}
