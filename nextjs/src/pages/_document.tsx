import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        <meta name="description" content="지금 인기 있는 영화를 확인하세요" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="영화 리뷰 서비스" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
