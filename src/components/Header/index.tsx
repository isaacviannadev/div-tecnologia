import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Button } from '../Button'
import { Container } from '../Container'
import { Logo } from '../Logo'

interface HeaderProps {
  panelId: string
  invert?: boolean
  icon: React.ElementType
  expanded: boolean
  onToggle: () => void
  toggleRef: React.RefObject<HTMLButtonElement>
}

function Header({
  panelId,
  invert = false,
  icon: Icon,
  expanded,
  onToggle,
  toggleRef,
}: HeaderProps) {
  const t = useTranslations('Header')

  return (
    <Container>
      <div className="flex items-center justify-between">
        <Link href="/" aria-label="Home">
          <Logo
            className={clsx(
              'h-12 sm:block',
              expanded ? 'text-white' : 'neutral-950',
            )}
          />
        </Link>
        <div className="flex items-center gap-x-8">
          <Button href="/contact" invert={invert}>
            {t('contactUs')}
          </Button>
          <button
            ref={toggleRef}
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            aria-controls={panelId}
            className={clsx(
              'group -m-2.5 rounded-full p-2.5 transition',
              invert ? 'hover:bg-white/10' : 'hover:bg-neutral-950/10',
            )}
            aria-label="Toggle navigation"
          >
            <Icon
              className={clsx(
                'h-6 w-6',
                invert
                  ? 'fill-white group-hover:fill-neutral-200'
                  : 'fill-neutral-950 group-hover:fill-neutral-700',
              )}
            />
          </button>
        </div>
      </div>
    </Container>
  )
}

export { Header }
