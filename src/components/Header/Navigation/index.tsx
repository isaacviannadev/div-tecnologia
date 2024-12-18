import { useTranslations } from 'next-intl';
import { NavigationItem } from './navigation-item';
import { NavigationRow } from './navigation-row';

function Navigation() {
  const t = useTranslations('Header');

  return (
    <nav className='mt-px font-display text-5xl font-medium tracking-tight text-white'>
      <NavigationRow>
        <NavigationItem href='/work'>{t('ourWork')}</NavigationItem>
        <NavigationItem href='/about'>{t('aboutUs')}</NavigationItem>
      </NavigationRow>
      <NavigationRow>
        <NavigationItem href='/process'>{t('ourProcess')}</NavigationItem>
        <NavigationItem href='/blog'>{t('Blog')}</NavigationItem>
      </NavigationRow>
    </nav>
  );
}

export { Navigation };
