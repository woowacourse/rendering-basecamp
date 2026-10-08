const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p";
const NO_IMAGE = "/images/no_image.png";

export const posterUrl = (path: string | null, size = "w500") =>
  path ? `${TMDB_IMAGE_URL}/${size}${path}` : NO_IMAGE;

export const backdropUrl = (path: string | null) =>
  path ? `${TMDB_IMAGE_URL}/w1920_and_h800_multi_faces${path}` : "";
