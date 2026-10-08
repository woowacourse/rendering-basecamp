const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

type TmdbImageSize = "w500" | "w780" | "original" | "w1920_and_h800_multi_faces";

export const NO_IMAGE_PATH = "/images/no_image.png";

export const getTmdbImageUrl = (size: TmdbImageSize, path: string) =>
  `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
