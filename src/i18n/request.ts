import { getRequestConfig } from 'next-intl/server'
import { cookies, headers } from 'next/headers'

const SUPPORTED_LOCALES = ['pt', 'en']
const DEFAULT_LOCALE = 'pt'
const LANGUAGE_COOKIE = 'NEXT_LOCALE'

function getLocaleFromHeaders(): string {
  try {
    const cookieStore = cookies()
    const headersList = headers()

    // Primeiro verifica se existe um cookie de preferência
    const cookieLocale = cookieStore.get(LANGUAGE_COOKIE)?.value
    if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)) {
      return cookieLocale
    }

    // Se não houver cookie, usa o accept-language
    const acceptLanguage = headersList.get('accept-language')
    if (!acceptLanguage) return DEFAULT_LOCALE

    const browserLocale = acceptLanguage.split(',')[0].split('-')[0]

    return SUPPORTED_LOCALES.includes(browserLocale)
      ? browserLocale
      : DEFAULT_LOCALE
  } catch (error: unknown) {
    console.error(error)
    return DEFAULT_LOCALE
  }
}

export default getRequestConfig(async () => {
  const locale = getLocaleFromHeaders()

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
