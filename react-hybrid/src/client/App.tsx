import { useLayoutEffect, useState } from 'react';
import { OverlayProvider } from 'overlay-kit';
import { Header } from './components/Header';
import { MovieList } from './components/MovieList';
import { Footer } from './components/Footer';
import { MovieDetailModal } from './components/MovieDetailModal';
import type { MovieItem } from './types/Movie.types';
import type { MovieDetailResponse } from './types/MovieDetail.types';

export interface InitialData {
  movies: MovieItem[];
  movie?: MovieDetailResponse;
}

export default function App({ initialData }: { initialData: InitialData }) {
  const { movies, movie } = initialData;
  const [isDetailOpen, setIsDetailOpen] = useState(Boolean(movie));

  // effect는 서버에서는 실행되지 않는다. 첫 commit을 관찰하는 표시이다.
  useLayoutEffect(() => {
    performance.mark('hydration-commit');
    performance.measure('hydration-to-commit', 'beforeRender', 'hydration-commit');
  }, []);

  return (
    <OverlayProvider>
      <div id="wrap">
        <Header featuredMovie={movies[0]} />
        <MovieList movies={movies} />
        <Footer />
      </div>
      {movie && isDetailOpen && (
        <MovieDetailModal
          movie={movie}
          onClose={() => {
            setIsDetailOpen(false);
            window.history.replaceState(null, '', '/');
          }}
        />
      )}
    </OverlayProvider>
  );
}
