import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import path from "path";
import { moviesApi } from "./service/tmdbApi";
import { Genre } from "./service/types";
import {
  getBaseMetaTagsHTML,
  getFooterHTML,
  getMovieListHTML,
  getOGMetaTagsHTML,
  getTopMovieHeaderHTML,
  getUrl,
} from "./utils";

const app = express();
const PORT = 8080;

app.use(express.json());

app.get("/", async (_req: Request, res: Response) => {
  const { results: movies } = await moviesApi.getPopular();
  const topMovie = movies[0];

  const topMovieImageUrl = topMovie.poster_path
    ? `https://image.tmdb.org/t/p/original${topMovie.poster_path}`
    : "/images/no_image.png";

  const ogMetaTags = getOGMetaTagsHTML({
    title: "영화 추천 사이트",
    description: `현재 인기 영화: ${topMovie.title}. ${
      topMovie.overview || "최신 인기 영화를 확인해보세요."
    }`,
    url: getUrl(_req),
    image: topMovieImageUrl,
  });

  res.send(/*html*/ `
<!DOCTYPE html>
<html lang="ko">
  <head>
    ${getBaseMetaTagsHTML()}
    ${ogMetaTags}
  </head>
  <body>
    <div id="wrap">
      ${getTopMovieHeaderHTML(topMovie)}
      <main>
        <section class="container">
          <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
          <ul class="thumbnail-list">
            ${getMovieListHTML(movies)}
          </ul>
        </section>
      </main>
      ${getFooterHTML}
    </div>
  </body>
</html>
        `);
});

app.get("/detail/:id", async (_req: Request, res: Response) => {
  const movieId = _req.params.id;
  const [{ results: movies }, selectedMovieDetail] = await Promise.all([
    moviesApi.getPopular(),
    moviesApi.getDetail(Number(movieId)),
  ]);

  const imageUrl = selectedMovieDetail.poster_path
    ? `https://image.tmdb.org/t/p/original${selectedMovieDetail.poster_path}`
    : "/images/no_image.png";

  const selectedMovieTitle = `${selectedMovieDetail.title} | 영화 리뷰`;

  const ogMetaTags = getOGMetaTagsHTML({
    title: selectedMovieTitle,
    description:
      selectedMovieDetail.overview || "영화 상세 정보를 확인해보세요.",
    url: getUrl(_req),
    type: "video.movie",
    image: imageUrl,
    movieReleaseDate: selectedMovieDetail.release_date,
    movieTags:
      selectedMovieDetail.genres?.map((genre) => genre.name).join(", ") || "",
  });

  res.send(/*html*/ `
<!DOCTYPE html>
<html lang="ko">
  <head>
    ${getBaseMetaTagsHTML({ title: selectedMovieTitle })}
    ${ogMetaTags}
  </head>
  <body>
    <div id="wrap">
      ${getTopMovieHeaderHTML(movies[0])}
      <main>
        <section class="container">
          <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
          <ul class="thumbnail-list">
            ${getMovieListHTML(movies)}
          </ul>
        </section>
      </main>
      ${getFooterHTML}
    </div>

    <div class="modal-background active">
      <div class="modal">
        <!-- 모달 헤더 -->
        <div class="modal-header">
          <h1 class="modal-title">${selectedMovieDetail.title}</h1>
          <img src="/images/modal_button_close.png" width="24" height="24" class="modal-close-btn" alt="Close" />
        </div>

        <div class="modal-container">
        <img src="https://image.tmdb.org/t/p/original${
          selectedMovieDetail.poster_path
        }" alt="${selectedMovieDetail.title}" class="modal-image" />
          <div class="modal-description">
            <!-- 영화 정보 섹션 -->
            <div class="movie-info-line">
              <span class="movie-meta">${selectedMovieDetail.genres
                .map((g: Genre) => g.name)
                .join(", ")}</span>
              <div class="movie-rating">
                <img src="/images/star_filled.png" width="16" height="16" />
                <span class="rating-value">${selectedMovieDetail.vote_average.toFixed(
                  1
                )}</span>
              </div>
            </div>

            <!-- 줄거리 -->
            <div class="overview-section">
              <p class="overview-text">${
                selectedMovieDetail.overview || "줄거리 정보가 없습니다."
              }</p>
            </div>

            <!-- 내 별점 섹션 -->
            <div class="my-rating-section">
              <div class="rating-header">
                <span class="rating-label">내 별점</span>
                <div class="star-rating">
                  <img src="/images/star_filled.png" width="24" height="24" alt="Star 1" />
                  <img src="/images/star_filled.png" width="24" height="24" alt="Star 2" />
                  <img src="/images/star_filled.png" width="24" height="24" alt="Star 3" />
                  <img src="/images/star_filled.png" width="24" height="24" alt="Star 4" />
                  <img src="/images/star_empty.png" width="24" height="24" alt="Star 5" />
                  <span class="rating-text">8 재미있어요</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
        `);
});

// public 폴더 속 정적 파일을 웹에서 접근할 수 있도록 만든다.
app.use(express.static(path.join(__dirname, "../public")));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
