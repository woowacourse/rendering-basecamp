export const ROUTES = {
  HOME: '/',
  MOVIE_DETAIL: (movieId: number) => `/detail/${movieId}`,
} as const;
