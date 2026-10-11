import { OverlayProvider } from 'overlay-kit';
import { RouteLoading } from './components/RouteLoading';
import Router from './router/Router';
import type { InitialData } from './router/context';

interface AppProps {
  initialData?: InitialData;
}

export default function App({ initialData }: AppProps) {
  return (
    <OverlayProvider>
      <RouteLoading />
      <Router initialData={initialData} />
    </OverlayProvider>
  );
}
