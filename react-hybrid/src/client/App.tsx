import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { OverlayProvider } from 'overlay-kit';
import MovieHomePage from './pages/MovieHomePage';
import { MovieItem } from './types/Movie.types';
import { MovieDetailResponse } from './types/MovieDetail.types';
import MovieDetailPage from './pages/MovieDetailPage';

interface AppProps {
  initialData: {
    movies: MovieItem[];
    movieDetail?: MovieDetailResponse;
  };
}

function App({ initialData }: AppProps) {
  return (
    <OverlayProvider>
      <Routes>
        <Route
          path="/"
          element={<MovieHomePage movies={initialData.movies} />}
        />
        <Route
          path="/detail/:id"
          element={
            <MovieDetailPage
              movies={initialData.movies}
              movieDetail={initialData.movieDetail}
            />
          }
        />
      </Routes>
    </OverlayProvider>
  );
}

export default App;
