import React, { useEffect } from 'react';
import { OverlayProvider } from 'overlay-kit';
import MovieHomePage from './pages/MovieHomePage';
import { MovieItem } from './types/Movie.types';
import { MovieDetailResponse } from './types/MovieDetail.types';
import { useMovieDetailModal } from './hooks/useMovieDetailModal';

interface AppProps {
  movies: MovieItem[];
  detail?: MovieDetailResponse;
}

function App({ movies, detail }: AppProps) {
  const { openMovieDetailModal } = useMovieDetailModal();

  useEffect(() => {
    if (detail) {
      openMovieDetailModal(detail);
    }
  }, [detail]);

  return (
    <OverlayProvider>
      <MovieHomePage movies={movies} />
    </OverlayProvider>
  );
}

export default App;
