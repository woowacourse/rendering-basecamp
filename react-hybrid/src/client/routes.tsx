import MovieHomePage from './pages/MovieHomePage';

export const routes = [
  {
    path: '/',
    component: MovieHomePage,
  },
  {
    path: '/detail/:id',
    component: MovieHomePage,
  },
  // { path: "/404", component: NotFoundPage },
];
