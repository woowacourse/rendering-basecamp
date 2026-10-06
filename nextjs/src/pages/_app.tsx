import type { AppProps } from 'next/app';
import { RouteLoading } from '@/components/RouteLoading';
import '../styles/index.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <RouteLoading />
      <Component {...pageProps} />
    </>
  );
}
