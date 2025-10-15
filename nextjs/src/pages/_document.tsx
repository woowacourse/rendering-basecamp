import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <title>영화 소개</title>
      <meta name="description" content="영화 소개를 위한 서비스" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
