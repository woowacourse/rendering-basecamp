import type { ComponentProps } from 'react';
import MovieHomePage from './pages/MovieHomePage';
import { defineRoutes } from './router/defineRoutes';

export const routes = defineRoutes([
  {
    path: '/',
    component: MovieHomePage,
  },
]);

export type RouteProps = ComponentProps<(typeof routes)[number]['component']>;
