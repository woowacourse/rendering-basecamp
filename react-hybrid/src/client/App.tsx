import { OverlayProvider } from 'overlay-kit';
import MovieHomePage from './pages/MovieHomePage';
import type { InitialData } from './types/InitialData.types';

interface AppProps {
  initialData: InitialData;
}

function App({ initialData }: AppProps) {
  return (
    <OverlayProvider>
      <MovieHomePage movies={initialData.movies} />
    </OverlayProvider>
  );
}

export default App;
