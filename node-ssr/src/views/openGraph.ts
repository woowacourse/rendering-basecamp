import { MovieDetail } from "../service/types";
import { escapeHtml } from "./escapeHtml";
import { posterUrl } from "./image";

const OG_DESCRIPTION_LENGTH = 100;

export const renderMovieOpenGraph = (movie: MovieDetail, pageUrl: string) => {
  const title = escapeHtml(movie.title);
  const description = escapeHtml(
    (movie.overview || "줄거리 정보가 없습니다.").slice(0, OG_DESCRIPTION_LENGTH)
  );

  return /*html*/ `
    <meta name="description" content="${description}" />
    <meta property="og:type" content="video.movie" />
    <meta property="og:site_name" content="영화 리뷰" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${posterUrl(movie.poster_path)}" />
    <meta property="og:url" content="${escapeHtml(pageUrl)}" />
    <meta name="twitter:card" content="summary_large_image" />
  `;
};
