import type { MovieDetailResponse } from "../client/types/MovieDetail.types";
import { SITE_NAME } from "../client/constants/site";
import { escapeHtml } from "./escapeHtml";

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w780";
const NO_IMAGE_PATH = "/images/no_image.png";
const DEFAULT_DESCRIPTION = "줄거리 정보가 없습니다.";

export const renderMovieOpenGraphTags = (movie: MovieDetailResponse, origin: string) => {
  const url = `${origin}/detail/${movie.id}`;
  const imagePath = movie.backdrop_path ?? movie.poster_path;
  const image = imagePath ? `${TMDB_IMAGE_BASE_URL}${imagePath}` : `${origin}${NO_IMAGE_PATH}`;
  const description = movie.overview || DEFAULT_DESCRIPTION;

  return [
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<meta property="og:type" content="video.movie" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:url" content="${escapeHtml(url)}" />`,
    `<meta property="og:title" content="${escapeHtml(movie.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:image" content="${escapeHtml(image)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ].join("\n    ");
};
