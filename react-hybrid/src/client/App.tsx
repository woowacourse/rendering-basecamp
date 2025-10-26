import React from 'react';
import { OverlayProvider } from 'overlay-kit';
import MovieHomePage from './pages/MovieHomePage';
import { MovieItem } from './types/Movie.types';
import { MovieDetailResponse } from './types/MovieDetail.types';
import MovieDetailPage from './pages/MovieDetailPage';

interface AppProps {
  page: 'home' | 'detail';
  initialData: {
    movies: MovieItem[];
    movieDetail?: MovieDetailResponse;
  };
}

function App({ page, initialData }: AppProps) {
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
