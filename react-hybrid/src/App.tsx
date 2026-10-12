import { RouteLoading } from './components/RouteLoading';
import Router from './router/Router';
import type { InitialData } from './router/context';

interface AppProps {
  initialData?: InitialData;
}

export default function App({ initialData }: AppProps) {
  return (
    <>
      <RouteLoading />
      <Router initialData={initialData} />
    </>
  );
}
