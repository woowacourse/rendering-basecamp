import { OverlayProvider } from 'overlay-kit';
import { Route, Routes } from 'react-router-dom';
import type { MovieItem } from './types/Movie.types';
import type { MovieDetailResponse } from './types/MovieDetail.types';
import MovieHomePage from './pages/MovieHomePage';
import MovieDetailPage from './pages/MovieDetailPage';

interface AppProps {
  movies: MovieItem[];
  movieDetail?: MovieDetailResponse;
}

function App({ movies, movieDetail }: AppProps) {
  return (
    <OverlayProvider>
      <Routes>
        <Route path="/" element={<MovieHomePage movies={movies} />} />
        <Route
          path="/detail/:movieId"
          element={
            <MovieDetailPage
              movies={movies}
              initialMovieDetail={movieDetail}
            />
          }
        />
      </Routes>
    </OverlayProvider>
  );
}

export default App;
