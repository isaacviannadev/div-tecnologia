'use client';
import { Toaster } from 'sonner';
import { SWRConfig } from 'swr';

export default function SWRProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SWRConfig
      value={{
        refreshInterval: 30000,
        fetcher: (resource, init) =>
          fetch(resource, init).then((res) => res.json()),
      }}
    >
      {children}
      <Toaster richColors position='top-center' />
    </SWRConfig>
  );
}
