import { getLocale } from 'next-intl/server'

export default async function Page() {
  const locale = await getLocale()
  const { default: Content } = await import(`./${locale}.mdx`)
  return <Content />
}
