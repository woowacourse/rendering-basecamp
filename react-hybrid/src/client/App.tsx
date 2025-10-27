import React, { useEffect } from 'react';
import { OverlayProvider } from 'overlay-kit';
import MovieHomePage from './pages/MovieHomePage';
import { MovieItem } from './types/Movie.types';
import { MovieDetailResponse } from './types/MovieDetail.types';
import MovieDetailPage from './pages/MovieDetailPage';
import { useMovieDetailModal } from './hooks/useMovieDetailModal';

interface AppProps {
  page: 'home' | 'detail';
  initialData: {
    movies: MovieItem[];
    movieDetail?: MovieDetailResponse;
  };
}

function App({ page, initialData }: AppProps) {
  const { openMovieDetailModal } = useMovieDetailModal();

  useEffect(() => {
    if (initialData.movieDetail) {
      openMovieDetailModal(initialData.movieDetail);
    }
  }, [initialData.movieDetail, openMovieDetailModal]);

  return (
    <OverlayProvider>
      {page === 'home' && <MovieHomePage movies={initialData.movies} />}
      {page === 'detail' && (
        <MovieDetailPage
          movies={initialData.movies}
          movieDetail={initialData.movieDetail}
        />
      )}
    </OverlayProvider>
  );
}

export default App;
