import { getRequestConfig } from 'next-intl/server'
import { headers } from 'next/headers'

const SUPPORTED_LOCALES = ['pt', 'en']
const DEFAULT_LOCALE = 'pt'

function getLocaleFromHeaders(): string {
  try {
    const headersList = headers()
    const acceptLanguage = headersList.get('accept-language')

    if (!acceptLanguage) return DEFAULT_LOCALE

    // Pega o primeiro idioma da lista de preferências do navegador
    const browserLocale = acceptLanguage.split(',')[0].split('-')[0]

    // Retorna o idioma se ele for suportado, caso contrário retorna o padrão
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
