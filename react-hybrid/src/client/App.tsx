import React from 'react';
import { OverlayProvider } from 'overlay-kit';
import { MovieItem } from './types/Movie.types';
import MovieHomePage from './pages/MovieHomePage';
import { MovieDetailResponse } from './types/MovieDetail.types';
import MovieDetailPage from './pages/MovieDetailPage';

type Props = {
  movies: MovieItem[];
  movieDetail?: MovieDetailResponse;
};

function App({ movies, movieDetail }: Props) {
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
