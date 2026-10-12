import type { ComponentProps } from 'react';
import { defineRoutes } from './router/defineRoutes';
import { moviesApi } from './api/movies';
import MovieListPage from './pages/MovieListPage';

export const routes = defineRoutes([
  {
    path: ['/', '/detail/:id'],
    component: MovieListPage,
    loader: async ({ params }) => {
      const [popularMovie, selectedMovie] = await Promise.all([
        moviesApi.getPopular(),
        params.id ? moviesApi.getDetail(Number(params.id)) : undefined,
      ]);

      return {
        movies: popularMovie.data.results,
        selectedMovie: selectedMovie?.data,
      };
    },
  },
]);

export type RouteProps = ComponentProps<(typeof routes)[number]['component']>;
