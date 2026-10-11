import React, { useEffect } from 'react';
import { OverlayProvider } from 'overlay-kit';
import MovieHomePage from './pages/MovieHomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import { MovieItem } from './types/Movie.types';
import { MovieDetailResponse } from './types/MovieDetail.types';

interface AppProps {
  movies: MovieItem[];
  movieDetail?: MovieDetailResponse;
}

function App({ movies, movieDetail }: AppProps) {
  useEffect(() => {
    performance.mark('hydrated');
    performance.measure('hydration (actual)', 'beforeRender', 'hydrated');
  }, []);

  return (
    <OverlayProvider>
      {movieDetail ? (
        <MovieDetailPage movies={movies} movieDetail={movieDetail} />
      ) : (
        <MovieHomePage movies={movies} />
      )}
    </OverlayProvider>
  );
}

export default App;
