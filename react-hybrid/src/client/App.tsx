import { OverlayProvider } from 'overlay-kit';
import { useLayoutEffect } from 'react';
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
  performance.mark('render start');

  useLayoutEffect(() => {
    performance.mark('hydration end');
    performance.measure('hydration 실제 작업', 'render start', 'hydration end');
    performance.measure('hydration 요청~완료', 'beforeRender', 'hydration end');
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
