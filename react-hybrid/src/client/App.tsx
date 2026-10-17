import { useState } from 'react';
import { OverlayProvider } from 'overlay-kit';
import { MovieDetailModal } from './components/MovieDetailModal';
import MovieHomePage from './pages/MovieHomePage';
import type { InitialData } from './types/InitialData.types';

interface AppProps {
  initialData: InitialData;
}

function App({ initialData }: AppProps) {
  const [movieDetail, setMovieDetail] = useState(initialData.movieDetail);

  const closeInitialMovieDetail = () => {
    setMovieDetail(undefined);
    window.history.replaceState(null, '', '/');
  };

  return (
    <OverlayProvider>
      <MovieHomePage movies={initialData.movies} />
      {movieDetail && (
        <MovieDetailModal
          movie={movieDetail}
          onClose={closeInitialMovieDetail}
        />
      )}
    </OverlayProvider>
  );
}

export default App;
