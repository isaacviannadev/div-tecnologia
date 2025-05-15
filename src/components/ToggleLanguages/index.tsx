import clsx from 'clsx'
import Cookies from 'js-cookie'
import { useLocale } from 'next-intl'
import { useState } from 'react'

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
          'rounded p-1 text-2xl transition-all duration-200 hover:bg-black/5',
          language === 'pt' ? 'bg-black/10 opacity-100' : 'opacity-50',
        )}
      >
        🇧🇷
      </button>
      <button
        onClick={() => toggleLanguage('en')}
        className={clsx(
          'rounded p-1 text-2xl transition-all duration-200 hover:bg-black/5',
          language === 'en' ? 'bg-black/10 opacity-100' : 'opacity-50',
        )}
      >
        🇺🇸
      </button>
    </div>
  )
}

export default ToggleLanguages
