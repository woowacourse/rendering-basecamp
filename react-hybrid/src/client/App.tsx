import React from 'react';
import { OverlayProvider } from 'overlay-kit';
import { MovieItem } from './types/Movie.types';
import MovieHomePage from './pages/MovieHomePage';

type Props = {
  movies: MovieItem[];
};

function App({ movies }: Props) {
  return (
    <OverlayProvider>
      <MovieHomePage movies={movies} />
    </OverlayProvider>
  );
}

export default App;
