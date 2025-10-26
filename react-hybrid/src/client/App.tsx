import React from 'react';
import { OverlayProvider } from 'overlay-kit';
import MovieHomePage from './pages/MovieHomePage';
import { MovieItem } from './types/Movie.types';

interface AppProps {
  initialPopularMovieList: MovieItem[] | null;
}

function App({ initialPopularMovieList }: AppProps) {
  return (
    <OverlayProvider>
      <MovieHomePage initialPopularMovieList={initialPopularMovieList} />
    </OverlayProvider>
  );
}

export default App;
