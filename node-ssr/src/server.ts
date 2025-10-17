import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import path from "path";
import { moviesApi } from "./service/tmdbApi";

const app = express();
const PORT = 8080;

app.use(express.json());

app.get("/", async (_req: Request, res: Response) => {
  const response = await moviesApi.getPopular();
  const movies = response.results;
  const titleMovie = movies[0];

  res.send(/*html*/ `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/styles/index.css" />
        <title>영화 리뷰</title>
      </head>
      <body>
        <div id="wrap">
          <header>
            <div class="background-container" style="background-image: url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${
              titleMovie.backdrop_path
            });">
              <div class="overlay"></div>
              <div class="top-rated-container">
                <img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" />
                <div class="top-rated-movie">
                  <div class="rate">
                    <img src="/images/star_empty.png" width="32" height="32" />
                    <span class="text-2xl font-semibold text-yellow">${titleMovie.vote_average.toFixed(
                      1
                    )}</span>
                  </div>
                  <h1 class="text-3xl font-semibold">${titleMovie.title}</h1>
                  <button class="primary detail">자세히 보기</button>
                </div>
              </div>
            </div>
          </header>
          <main>
            <section class="container">
              <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
              <ul class="thumbnail-list">
                ${movies
                  .map(
                    (movie) => `
                <li class="movie-item">
                  <div class="item">
                    <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face${
                      movie.poster_path
                    }" alt="${movie.title}" loading="lazy" />
                    <div class="item-desc">
                      <p class="rate">
                        <img src="/images/star_empty.png" class="star" />
                        <span>${movie.vote_average.toFixed(1)}</span>
                      </p>
                      <strong>${movie.title}</strong>
                    </div>
                  </div>
                </li>
                `
                  )
                  .join("")}
              </ul>
            </section>
          </main>
          <footer class="footer">
            <p>&copy; 우아한테크코스 All Rights Reserved.</p>
            <p><img src="/images/woowacourse_logo.png" width="180" alt="우아한테크코스" /></p>
          </footer>
        </div>
      </body>
    </html>
        `);
});

app.get("/detail/:id", async (req: Request, res: Response) => {
  const response = await moviesApi.getPopular();
  const movies = response.results;
  const titleMovie = movies[0];

  const { id } = req.params;
  const movieData = await moviesApi.getDetail(Number(id));

  res.send(/*html*/ `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/styles/index.css" />
        <title>${movieData.title} - 영화 리뷰</title>
      </head>
      <body>
        <div id="wrap">
          <header>
            <div class="background-container" style="background-image: url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${
              titleMovie.backdrop_path
            });">
              <div class="overlay"></div>
              <div class="top-rated-container">
                <img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" />
                <div class="top-rated-movie">
                  <div class="rate">
                    <img src="/images/star_empty.png" width="32" height="32" />
                    <span class="text-2xl font-semibold text-yellow">${titleMovie.vote_average.toFixed(
                      1
                    )}</span>
                  </div>
                  <h1 class="text-3xl font-semibold">${titleMovie.title}</h1>
                  <button class="primary detail">자세히 보기</button>
                </div>
              </div>
            </div>
          </header>
          <main>
            <section class="container">
              <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
              <ul class="thumbnail-list">
                ${movies
                  .map(
                    (movie) => `
                <li class="movie-item">
                  <div class="item">
                    <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face${
                      movie.poster_path
                    }" alt="${movie.title}" loading="lazy" />
                    <div class="item-desc">
                      <p class="rate">
                        <img src="/images/star_empty.png" class="star" />
                        <span>${movie.vote_average.toFixed(1)}</span>
                      </p>
                      <strong>${movie.title}</strong>
                    </div>
                  </div>
                </li>
                `
                  )
                  .join("")}
              </ul>
            </section>
          </main>
          <footer class="footer">
            <p>&copy; 우아한테크코스 All Rights Reserved.</p>
            <p><img src="/images/woowacourse_logo.png" width="180" alt="우아한테크코스" /></p>
          </footer>
        </div>

        <div class="modal-background active">
          <div class="modal">
            <!-- 모달 헤더 -->
            <div class="modal-header">
              <h1 class="modal-title">${movieData.title}</h1>
              <img src="/images/modal_button_close.png" width="24" height="24" class="modal-close-btn" alt="Close" />
            </div>

            <div class="modal-container">
              <img src="https://image.tmdb.org/t/p/original/${
                movieData.poster_path
              }" alt="${movieData.title}" class="modal-image" />
              <div class="modal-description">
                <!-- 영화 정보 섹션 -->
                <div class="movie-info-line">
                  <span class="movie-meta">${movieData.genres
                    .map((genre) => genre.name)
                    .join(", ")}</span>
                  <div class="movie-rating">
                    <img src="/images/star_filled.png" width="16" height="16" />
                    <span class="rating-value">${movieData.vote_average.toFixed(
                      1
                    )}</span>
                  </div>
                </div>

                <!-- 줄거리 -->
                <div class="overview-section">
                  <p class="overview-text">
                    ${movieData.overview}
                  </p>
                </div>

                <!-- 내 별점 섹션 -->
                <div class="my-rating-section">
                  <div class="rating-header">
                    <span class="rating-label">내 별점</span>
                    <div class="star-rating">
                      <img src="/images/star_empty.png" width="24" height="24" alt="Star 1" />
                      <img src="/images/star_empty.png" width="24" height="24" alt="Star 2" />
                      <img src="/images/star_empty.png" width="24" height="24" alt="Star 3" />
                      <img src="/images/star_empty.png" width="24" height="24" alt="Star 4" />
                      <img src="/images/star_empty.png" width="24" height="24" alt="Star 5" />
                      <span class="rating-text">평가하기</span>
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
