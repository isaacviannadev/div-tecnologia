import { useTranslations } from 'next-intl';
import Office from './office';

type OfficesProps = {
  invert?: boolean;
  className?: string;
  props?: React.HTMLProps<HTMLUListElement>;
};

export function Offices({ invert = false, className, ...props }: OfficesProps) {
  const t = useTranslations('Offices');

  return (
    <ul className={className} {...props}>
      <li>
        <Office name={t('brazil')} invert={invert}>
          R. Diogo Camarão, 18 - Duque de Caxias
          <br />
          Rio de Janeiro
        </Office>
      </li>
      <li>
        <Office name={t('portugal')} invert={invert}>
          R. dos Vinagres, 27 - Pombal
          <br />
          Leiria
        </Office>
      </li>
    </ul>
  );
}
