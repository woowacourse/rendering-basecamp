import type { ReactNode } from 'react';
import Head from './document/Head';
import AppScript from './document/AppScript';
import { useAppData } from './document/context';
export { AppDataContext } from './document/context';

interface DocumentProps {
  children?: ReactNode;
}

export default function Document({ children }: DocumentProps) {
  const { origin } = useAppData();

  return (
    <html lang="ko">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>영화 리뷰</title>
        <meta name="description" content="인기 영화를 살펴보고 나만의 별점을 남겨보세요." />
        <meta property="og:title" content="영화 리뷰" />
        <meta property="og:description" content="인기 영화를 살펴보고 나만의 별점을 남겨보세요." />
        <meta property="og:image" content={new URL('/static/images/og_default.png', origin).href} />
        <meta property="og:site_name" content="영화 리뷰" />
        <meta property="og:locale" content="ko_KR" />
      </Head>
      <body>
        {children}
        <AppScript />
      </body>
    </html>
  );
}
