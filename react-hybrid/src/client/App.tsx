import React, { useEffect } from 'react';
import { OverlayProvider } from 'overlay-kit';
import MovieHomePage from './pages/MovieHomePage';
import { MovieItem } from './types/Movie.types';
import { MovieDetailResponse } from './types/MovieDetail.types';
import { MovieDetailModal } from './components/MovieDetailModal';
import { navigateToHome } from './utils/navigation';

interface AppProps {
  initialMovies?: MovieItem[];
  detail?: MovieDetailResponse;
}

function App({ initialMovies, detail }: AppProps) {
  return (
    <OverlayProvider>
      <MovieHomePage initialMovies={initialMovies} />
      {detail && <MovieDetailModal movie={detail} onClose={navigateToHome} />}
    </OverlayProvider>
  );
}

export default App;
