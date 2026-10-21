const DETAIL_PATH_REGEX = /^\/detail\/(\d+)\/?$/;

export const getDetailPath = (movieId: number) => `/detail/${movieId}`;

export const parseDetailMovieId = (pathname: string): number | null => {
  const matched = pathname.match(DETAIL_PATH_REGEX);
  return matched ? Number(matched[1]) : null;
};
