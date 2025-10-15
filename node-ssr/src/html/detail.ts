import { moviesApi } from "../service/tmdbApi";
import {
  generateMetaTags,
  generateHeader,
  generateMovieList,
  generateFooter,
  generateModal,
  TMDB_IMAGE_BASE_URL,
} from "./htmlUtils";

export const getDetailHtml = async (movieId: number) => {
  const movie = await moviesApi.getDetail(movieId);
  const moviesResponse = await moviesApi.getPopular();
  const movies = moviesResponse.results;
  const topMovie = movies[0];

  const ogImage = movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL.ORIGINAL}${movie.poster_path}`
    : "";

  return `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        ${generateMetaTags({
          description: `${movie.title} - ${movie.overview.substring(
            0,
            100
          )}... 영화 상세 정보와 리뷰를 확인하세요.`,
          keywords: `${movie.title}, ${movie.genres
            .map((g) => g.name)
            .join(", ")}, 영화 리뷰, 영화 평점`,
          title: "영화 리뷰",
          ogTitle: `${movie.title} - 영화 리뷰`,
          ogDescription: movie.overview,
          ogImage,
          ogUrl: "https://movie-review.woowacourse.com/modal.html",
        })}

        <link rel="stylesheet" href="/styles/index.css" />
        <title>영화 리뷰</title>
      </head>
      <body>
        <div id="wrap">
          ${generateHeader(topMovie)}
          <main>
            <section class="container">
              <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
              ${generateMovieList(movies)}
            </section>
          </main>
          ${generateFooter()}
        </div>

        ${generateModal(movie)}
      </body>
    </html>
  `;
};
