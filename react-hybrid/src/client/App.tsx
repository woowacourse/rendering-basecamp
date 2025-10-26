import React from 'react';
import { OverlayProvider } from 'overlay-kit';
import MovieHomePage from './pages/MovieHomePage';
import MovieDetailPage from './pages/MovieDetailPage';

import { MovieItem } from './types/Movie.types';
import { MovieDetailResponse } from './types/MovieDetail.types';
import { useHistory } from './hooks/useHistory';

interface AppProps {
  initialMovies?: MovieItem[];
  initialMovieDetail?: MovieDetailResponse;
  path?: string;
}

function matchRoute(pathname: string): 'home' | 'detail' | 'notfound' {
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/detail/')) return 'detail';
  return 'notfound';
}

function App({ initialMovies, initialMovieDetail, path }: AppProps) {
  const { currentPath } = useHistory(path);

  const currentPage = matchRoute(currentPath);

  return (
    <OverlayProvider>
      {currentPage === 'home' && <MovieHomePage initialMovies={initialMovies} />}
      {currentPage === 'detail' && (
        <MovieDetailPage
          initialMovies={initialMovies}
          initialMovieDetail={initialMovieDetail}
        />
      )}
    </OverlayProvider>
  );
}

export default App;
