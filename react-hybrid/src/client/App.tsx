import React from 'react';
import { OverlayProvider } from 'overlay-kit';
import MovieHomePage from './pages/MovieHomePage';
import MovieDetailPage from './pages/MovieDetailPage';

function App() {
  const initialData = window.__INITIAL_DATA__;
  const pathname = window.location.pathname;

  const isMovieDetailPage = pathname.startsWith('/detail/');

  return (
    <OverlayProvider>
      {isMovieDetailPage ? (
        <MovieDetailPage
          movies={initialData.movies}
          movieId={initialData.movieId}
          movieDetail={initialData.movieDetail}
        />
      ) : (
        <MovieHomePage movies={initialData.movies} />
      )}
    </OverlayProvider>
  );
}

export default App;
