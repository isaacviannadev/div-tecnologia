import { JSX } from 'react'

import { useTranslations } from 'next-intl'
import Link from 'next/link'

import { socialMediaProfiles } from '../SocialMedia'

type NavigationLink = {
  title: string | JSX.Element
  href: string
  icon?: React.ComponentType
}

type NavigationSection = {
  title: string
  links: NavigationLink[]
}

function Navigation() {
  const t = useTranslations('Footer')

  const navigation: NavigationSection[] = [
    {
      title: t('navHeaders.work'),
      links: [
        { title: t('navItems.zeloclub'), href: '/work/zeloclub' },
        { title: t('navItems.activ8'), href: '/work/activ8' },
        { title: t('navItems.worten'), href: '/work/worten' },
        {
          title: (
            <>
              {t('seeAll')} <span aria-hidden="true">&rarr;</span>
            </>
          ),
          href: '/work',
        },
      ],
    },
    {
      title: t('navHeaders.company'),
      links: [
        { title: t('navItems.about'), href: '/about' },
        { title: t('navItems.process'), href: '/process' },
        { title: t('navItems.blog'), href: '/blog' },
        { title: t('navItems.contactUs'), href: '/contact' },
      ],
    },
    {
      title: t('navHeaders.connect'),
      links: socialMediaProfiles,
    },
  ]

  return (
    <nav>
      <ul className="grid grid-cols-2 gap-8 sm:grid-cols-3">
        {navigation.map((section) => (
          <li key={section.title}>
            <div className="font-display text-sm font-semibold tracking-wider text-neutral-950">
              {section.title}
            </div>
            <ul className="mt-4 text-sm text-neutral-700">
              {section.links.map((link) => (
                <li
                  key={typeof link.title === 'string' ? link.title : link.href}
                  className="mt-4"
                >
                  <Link
                    href={link.href}
                    className="transition hover:text-neutral-950"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export { Navigation }
