declare module '*.mdx' {
  import type { ReactNode } from 'react';

  export const metadata: {
    title: string;
    date: string;
  };

  const MDXComponent: (props: { children: ReactNode }) => JSX.Element;
  export default MDXComponent;
}
