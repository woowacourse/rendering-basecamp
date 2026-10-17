import { OverlayProvider } from 'overlay-kit';
import { useEffect } from 'react';
import type { MovieItem } from './types/Movie.types';
import type { MovieDetailResponse } from './types/MovieDetail.types';
import MovieHomePage from './pages/MovieHomePage';
import MovieDetailPage from './pages/MovieDetailPage';

type Props = {
  path: string;
  movies: MovieItem[];
  movieDetail?: MovieDetailResponse;
};

function App({ path, movies, movieDetail }: Props) {
  useEffect(() => {
    performance.mark('hydration effect');
    performance.measure('hydration effect', 'beforeRender', 'hydration effect');
  }, []);

  const [, route, movieId] = path.split('/');
  return (
    <OverlayProvider>
      {path === '/' && <MovieHomePage movies={movies} />}
      {route === 'detail' && movieId && (
        <MovieDetailPage movies={movies} movieDetail={movieDetail} />
      )}
    </OverlayProvider>
  );
}

export default App;
