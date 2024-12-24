import clsx from 'clsx'
import Link from 'next/link'
import Icons from '../Icons'

export const socialMediaProfiles = [
  { title: 'Facebook', href: 'https://facebook.com', icon: Icons.FacebookIcon },
  {
    title: 'Instagram',
    href: 'https://instagram.com',
    icon: Icons.InstagramIcon,
  },
  { title: 'GitHub', href: 'https://github.com', icon: Icons.GitHubIcon },
  { title: 'Dribbble', href: 'https://dribbble.com', icon: Icons.DribbbleIcon },
]

export function SocialMedia({
  className,
  invert = false,
}: {
  className?: string
  invert?: boolean
}) {
  return (
    <ul
      className={clsx(
        'flex gap-x-10',
        invert ? 'text-white' : 'text-neutral-950',
        className,
      )}
    >
      {socialMediaProfiles.map((socialMediaProfile) => (
        <li key={socialMediaProfile.title}>
          <Link
            href={socialMediaProfile.href}
            aria-label={socialMediaProfile.title}
            className={clsx(
              'transition',
              invert ? 'hover:text-neutral-200' : 'hover:text-neutral-700',
            )}
          >
            <socialMediaProfile.icon className="h-6 w-6 fill-current" />
          </Link>
        </li>
      ))}
    </ul>
  )
}
