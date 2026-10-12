import type { ReactNode } from 'react';
import Head from './document/Head';
import AppScript from './document/AppScript';
export { AppDataContext } from './document/context';

interface DocumentProps {
  children?: ReactNode;
}

export default function Document({ children }: DocumentProps) {
  return (
    <html lang="ko">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>영화 리뷰</title>
      </Head>
      <body>
        {children}
        <AppScript />
      </body>
    </html>
  );
}
