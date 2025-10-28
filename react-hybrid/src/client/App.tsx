import React, { useEffect } from "react";
import { OverlayProvider } from "overlay-kit";
import { MovieItem } from './types/Movie.types';
import { MovieDetailResponse } from './types/MovieDetail.types';
import MovieHomePage from './pages/MovieHomePage';
import { useMovieDetailModal } from './hooks/useMovieDetailModal';

interface AppProps {
  initialMovies: MovieItem[];
}

function AppContent({ initialMovies }: AppProps) {
  const { openMovieDetailModal } = useMovieDetailModal();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initialData = (window as any).__INITIAL_DATA__;
    const detail: MovieDetailResponse | undefined = initialData?.detail;

    if (detail) {
      openMovieDetailModal(detail);
    }
  }, []);

  return <MovieHomePage initialMovies={initialMovies} />;
}

function App({ initialMovies }: AppProps) {
  return (
    <OverlayProvider>
      <AppContent initialMovies={initialMovies} />
    </OverlayProvider>
  );
}

export default App;
