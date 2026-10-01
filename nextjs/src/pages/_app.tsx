import type { AppProps } from 'next/app';
import Head from 'next/head';
import '@/styles/index.css';
import { OverlayProvider } from 'overlay-kit';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <OverlayProvider>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Component {...pageProps} />
        </OverlayProvider>
    );
}
