import React, { useEffect } from 'react';
import { OverlayProvider } from 'overlay-kit';
import MovieHomePage from './pages/MovieHomePage';
import { MovieItem } from './types/Movie.types';
import MovieDetailPage from './pages/MovieDetailPage';
import { MovieDetailResponse } from './types/MovieDetail.types';

interface AppProps {
  movies?: MovieItem[];
  movieDetail?: MovieDetailResponse;
}

function App({ movies, movieDetail }: AppProps) {
  const isDetailPage = movieDetail != null;

  useEffect(() => {
    const handlePopState = () => {
      window.location.reload();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <OverlayProvider>
      {isDetailPage ? (
        <MovieDetailPage movies={movies} movieDetail={movieDetail} />
      ) : (
        <MovieHomePage movies={movies} />
      )}
    </OverlayProvider>
  );
}

export default App;
