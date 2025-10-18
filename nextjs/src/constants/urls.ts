export const BASE_URL = "https://rendering-basecamp-xi.vercel.app";
export const NO_IMAGE_URL = `${BASE_URL}/images/no_image.png`;
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
export const HOME_URL = `${BASE_URL}/`;

export const getMovieDetailUrl = (movieId: string | number) =>
  `${BASE_URL}/detail/${movieId}`;

export const getTMDBImageUrl = (
  posterPath: string | null | undefined,
  size: string = "original"
) => {
  if (!posterPath) return NO_IMAGE_URL;
  return `${TMDB_IMAGE_BASE_URL}/${size}${posterPath}`;
};
