import React from 'react';
import { OverlayProvider } from 'overlay-kit';
import {
  createBrowserRouter,
  createMemoryRouter,
  RouterProvider,
} from 'react-router-dom';

import MovieHomePage from './pages/MovieHomePage';
import MovieDetailPage from './pages/MovieDetailPage';

import type { MovieItem } from './types/Movie.types';
import type { MovieDetailResponse } from './types/MovieDetail.types';

interface AppProps {
  initialMovies?: MovieItem[];
  initialDetailMovie?: MovieDetailResponse;
  initialPath?: string;
}

function App({
  initialMovies,
  initialDetailMovie,
  initialPath = '/',
}: AppProps) {
  const routes = [
    {
      path: '/',
      element: <MovieHomePage initialMovies={initialMovies} />,
    },
    {
      path: '/detail/:movieId',
      element: (
        <MovieDetailPage
          initialMovies={initialMovies}
          initialMovieDetail={initialDetailMovie}
        />
      ),
    },
  ];

  const router =
    // CSR에서는 브라우저 주소창과 동기화되는 BrowserRouter 사용
    // SSR에서는 실제 브라우저가 없으니까 메모리 기반 라우터 사용
    // initialEntries로 요청된 경로를 초기 진입점으로 설정
    typeof window !== 'undefined'
      ? createBrowserRouter(routes)
      : createMemoryRouter(routes, { initialEntries: [initialPath] });

  return (
    <OverlayProvider>
      <RouterProvider router={router} />
    </OverlayProvider>
  );
}

export default App;
