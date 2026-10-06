import type { AppProps } from 'next/app';
import { RouteLoading } from '@/components/RouteLoading';
import { useRouteLoading } from '@/hooks/useRouteLoading';
import { useDataLoading } from '@/hooks/useDataLoading';
import '../styles/index.css';

export default function App({ Component, pageProps }: AppProps) {
  const isRouteLoading = useRouteLoading();
  const isDataLoading = useDataLoading();

  return (
    <>
      <RouteLoading isLoading={isRouteLoading || isDataLoading} />
      <Component {...pageProps} />
    </>
  );
}
