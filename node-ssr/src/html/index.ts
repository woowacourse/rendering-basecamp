import { moviesApi } from "../service/tmdbApi";
import {
  generateMetaTags,
  generateHeader,
  generateMovieList,
  generateFooter,
  TMDB_IMAGE_BASE_URL,
} from "./htmlUtils";

export const getIndexHtml = async () => {
  const moviesResponse = await moviesApi.getPopular();
  const movies = moviesResponse.results;
  const topMovie = movies[0];

  const ogImage = topMovie.backdrop_path
    ? `${TMDB_IMAGE_BASE_URL.BACKDROP}${topMovie.backdrop_path}`
    : "";

  return `
  <!DOCTYPE html>
  <html lang="ko">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      ${generateMetaTags({
        description:
          "지금 인기 있는 영화를 확인하고 평점과 리뷰를 공유하세요. 최신 영화 정보를 제공합니다.",
        keywords: "영화, 리뷰, 평점, 영화 추천, 인기 영화, 무비, 영화 정보",
        title: "영화 리뷰",
        ogTitle: "영화 리뷰 - 지금 인기 있는 영화",
        ogDescription: `지금 인기 있는 영화를 확인하고 평점과 리뷰를 공유하세요. ${topMovie.title}를 포함한 최신 영화 정보를 제공합니다.`,
        ogImage,
        ogUrl: "https://movie-review.woowacourse.com",
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
    </body>
  </html>
`;
};
