import clsx from 'clsx'
import Cookies from 'js-cookie'
import { useLocale } from 'next-intl'
import { useState } from 'react'
import Icons from '../Icons'

type ToggleLanguagesProps = {
  className?: string
}

const LANGUAGE_COOKIE = 'NEXT_LOCALE'

const ToggleLanguages = ({ className = '' }: ToggleLanguagesProps) => {
  const locale = useLocale()
  const [language, setLanguage] = useState(locale)

  const toggleLanguage = (newLanguage: string) => {
    setLanguage(newLanguage)
    // Define o cookie com a nova preferência de idioma
    Cookies.set(LANGUAGE_COOKIE, newLanguage, { path: '/' })
    // Recarrega a página para aplicar o novo idioma
    window.location.reload()
  }

  return (
    <div className={clsx('flex items-center gap-2', className)}>
      <button
        onClick={() => toggleLanguage('pt')}
        className={clsx(
          'h-6 w-6 rounded transition-all duration-200 hover:scale-110 hover:bg-black/5 hover:saturate-100',
          language === 'pt' ? 'bg-black/10 opacity-100' : 'saturate-0',
        )}
      >
        <Icons.BrazilFlagIcon className="h-full w-full" />
      </button>
      <button
        onClick={() => toggleLanguage('en')}
        className={clsx(
          'h-6 w-6 rounded transition-all duration-200 hover:scale-105 hover:bg-black/5 hover:saturate-100',
          language === 'en' ? 'bg-black/10 opacity-100' : 'saturate-0',
        )}
      >
        <Icons.USAFlagIcon className="h-full w-full" />
      </button>
    </div>
  )
}

export default ToggleLanguages
