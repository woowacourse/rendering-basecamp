import type { AppProps } from "next/app";
import Head from "next/head";
import { OverlayProvider } from "overlay-kit";
import "@/styles/index.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <OverlayProvider>
        <Component {...pageProps} />
      </OverlayProvider>
    </>
  );
}
