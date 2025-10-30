import React from 'react';
import { OverlayProvider } from 'overlay-kit';
import MovieHomePage from './pages/MovieHomePage';
import MovieDetailPage from './pages/MovieDetailPage';

const routes = [
  {
    path: '/detail/',
    component: MovieDetailPage,
    getProps: (data: any) => ({
      movies: data.movies,
      movieId: data.movieId,
      movieDetail: data.movieDetail,
    }),
  },
  {
    path: '/',
    component: MovieHomePage,
    getProps: (data: any) => ({
      movies: data.movies,
    }),
  },
];

function App() {
  const initialData = window.__INITIAL_DATA__;
  const pathname = window.location.pathname;

  const currentRoute =
    routes.find((route) => pathname.startsWith(route.path)) ||
    routes[routes.length - 1];

  const Component = currentRoute.component;
  const props = currentRoute.getProps(initialData);

  return (
    <OverlayProvider>
      <Component {...props} />
    </OverlayProvider>
  );
}

export default App;
