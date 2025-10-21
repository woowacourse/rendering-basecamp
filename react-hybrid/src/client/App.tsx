import { OverlayProvider } from 'overlay-kit';
import { InitialData } from './types/global';

interface AppProps {
  Component: React.ComponentType<{ initialData: InitialData }>;
  initialData: InitialData;
}

function App({ Component, initialData }: AppProps) {
  return (
    <OverlayProvider>
      <Component initialData={initialData} />
    </OverlayProvider>
  );
}

export default App;
