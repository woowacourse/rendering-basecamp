import React, { useLayoutEffect } from 'react';
import { OverlayProvider } from 'overlay-kit';
import MovieHomePage from './pages/MovieHomePage';
import MovieDetailPage from './pages/MovieDetailPage';

function App({ initialData }: { initialData: InitialData }) {
  useLayoutEffect(() => {
    // 초기 화면이 React에 연결되어 DOM에 반영된 시점
    performance.mark('appCommitted');
    performance.measure('hydration_commit', 'beforeRender', 'appCommitted');
  }, []);

  return (
    <OverlayProvider>
      {initialData.page === 'home' ? (
        <MovieHomePage movies={initialData.movies} />
      ) : (
        <MovieDetailPage
          movieId={initialData.movieId}
          movies={initialData.movies}
          movieDetail={initialData.movieDetail ?? null}
        />
      )}
    </OverlayProvider>
  );
}

export default App;
