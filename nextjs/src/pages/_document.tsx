import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ko_KR" />
        <meta property="og:site_name" content="세라의 영화 앱" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
