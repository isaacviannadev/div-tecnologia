import { getLocale } from 'next-intl/server'

export async function formatDate(dateString: string) {
  const parts = dateString.split('-')
  const hasDay = parts.length > 2
  const locale = await getLocale()

  if (locale === 'pt') {
    return new Date(`${dateString}Z`).toLocaleDateString('pt-BR', {
      day: hasDay ? 'numeric' : undefined,
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    })
  }

  return new Date(`${dateString}Z`).toLocaleDateString('en-US', {
    day: hasDay ? 'numeric' : undefined,
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
