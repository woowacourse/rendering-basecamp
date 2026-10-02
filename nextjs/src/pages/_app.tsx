import type { AppProps } from "next/app";
import Head from "next/head";
import "@/styles/index.css";
import "@/styles/next.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/logo.png" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
