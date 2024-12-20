import type { Metadata } from 'next';

import { RootLayout } from '@div/components/RootLayout';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

import SWRProvider from '@div/components/Providers';
import './globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | DIV Tech',
    default: 'DIV Tech - Consulting & Development',
  },
  description:
    'DIV Tech is a consulting and development company that specializes in building web applications and websites.',
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  const messages = await getMessages();
  return (
    <html lang={locale} className='h-full bg-neutral-950 text-base antialiased'>
      <body className='flex min-h-full flex-col'>
        <SWRProvider>
          <NextIntlClientProvider messages={messages}>
            <RootLayout>{children}</RootLayout>
          </NextIntlClientProvider>
        </SWRProvider>
      </body>
    </html>
  );
}
