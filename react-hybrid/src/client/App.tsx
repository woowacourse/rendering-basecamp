import React, { useEffect } from 'react';
import { OverlayProvider } from 'overlay-kit';
import MovieHomePage from './pages/MovieHomePage';
import { MovieItem } from './types/Movie.types';
import { MovieDetailResponse } from './types/MovieDetail.types';
import { useMovieDetailModal } from './hooks/useMovieDetailModal';

interface AppProps {
  initialPopularMovieList: MovieItem[] | null;
  initialMovieDetail?: MovieDetailResponse | null;
}

function App({ initialPopularMovieList, initialMovieDetail }: AppProps) {
  const { openMovieDetailModal } = useMovieDetailModal();

  useEffect(() => {
    if (initialMovieDetail !== undefined) {
      openMovieDetailModal(initialMovieDetail);
    }
  }, [initialMovieDetail, openMovieDetailModal]);

  return (
    <OverlayProvider>
      <MovieHomePage initialPopularMovieList={initialPopularMovieList} />
    </OverlayProvider>
  );
}

export default App;
