import type { AppProps } from 'next/app';
import { OverlayProvider } from 'overlay-kit';
import './index.css';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="google-site-verification"
          content="xMsb85PHzaykeoVW3mvmUlBHXrmBS0TFMuIy9MOZPr8"
        />
      </Head>
      <OverlayProvider>
        <Component {...pageProps} />;
      </OverlayProvider>
    </>
  );
}
