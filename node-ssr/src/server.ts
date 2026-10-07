import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import path from "path";
import { moviesApi } from "./service/tmdbApi";
import { Movie, MovieDetail } from "./service/types";

const app = express();
const PORT = 8080;

const renderHome = (movies: Movie[]) => {
  const featuredMovie = movies[0];
  const movieItems = movies
    .map(
      (movie) => /* html */ `
        <li class="movie-item">
          <div class="item">
            <img
              class="thumbnail"
              src="${
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "/images/no_image.png"
              }"
              alt="${movie.title}"
              loading="lazy"
            />
            <div class="item-desc">
              <p class="rate">
                <img src="/images/star_empty.png" class="star" alt="" />
                <span>${movie.vote_average.toFixed(1)}</span>
              </p>
              <strong>${movie.title}</strong>
            </div>
          </div>
        </li>
      `,
    )
    .join("");

  return /* html */ `
    <div id="wrap">
    <header>
      <div
        class="background-container"
        style="background-image: url(${
          featuredMovie.poster_path
            ? `https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${featuredMovie.poster_path}`
            : "/images/no_image.png"
        })"
      >
        <div class="overlay"></div>
        <div class="top-rated-container">
          <img
            src="/images/logo.png"
            width="117"
            height="20"
            class="logo"
            alt="MovieLogo"
          />
          <div class="top-rated-movie">
            <div class="rate">
              <img
                src="/images/star_empty.png"
                width="32"
                height="32"
                alt=""
              />
              <span class="text-2xl font-semibold text-yellow">
                ${featuredMovie.vote_average.toFixed(1)}
              </span>
            </div>
            <h1 class="text-3xl font-semibold">${featuredMovie.title}</h1>
            <button class="primary detail">자세히 보기</button>
          </div>
        </div>
      </div>
    </header>

    <main>
      <section class="container">
        <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
        <ul class="thumbnail-list">
          ${movieItems}
        </ul>
      </section>
    </main>

    <footer class="footer">
      <p>&copy; 우아한테크코스 All Rights Reserved.</p>
      <p>
        <img
          src="/images/woowacourse_logo.png"
          width="180"
          alt="우아한테크코스"
        />
      </p>
    </footer>
    </div>
  `;
};

const renderModal = (movie: MovieDetail) => {
  const genreNames = movie.genres.map((genre) => genre.name).join(", ");
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
    : "/images/no_image.png";

  return /* html */ `
    <div class="modal-background active">
      <div class="modal">
        <div class="modal-header">
          <h1 class="modal-title">${movie.title}</h1>
          <button class="modal-close-btn">
            <img
              src="/images/modal_button_close.png"
              width="24"
              height="24"
              alt="닫기"
            />
          </button>
        </div>

        <div class="modal-container">
          <img src="${imageUrl}" alt="${movie.title}" class="modal-image" />
          <div class="modal-description">
            <div class="movie-info-line">
              <span class="movie-meta">${genreNames}</span>
              <div class="movie-rating">
                <img
                  src="/images/star_filled.png"
                  width="16"
                  height="16"
                  alt=""
                />
                <span class="rating-value">${movie.vote_average.toFixed(1)}</span>
              </div>
            </div>

            <div class="overview-section">
              <p class="overview-text">
                ${movie.overview || "줄거리 정보가 없습니다."}
              </p>
            </div>

            <div class="my-rating-section">
              <div class="rating-header">
                <span class="rating-label">내 별점</span>
                <div class="star-rating">
                  ${Array.from(
                    { length: 5 },
                    (_, index) => /* html */ `
                      <button>
                        <img
                          src="/images/star_empty.png"
                          width="24"
                          height="24"
                          alt="Star ${index + 1}"
                        />
                      </button>
                    `,
                  ).join("")}
                  <span class="rating-text">0 별점을 남겨주세요</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

app.use(express.json());

app.get("/", async (_req: Request, res: Response) => {
  const { results: movies } = await moviesApi.getPopular();

  const html = /* html */ `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/styles/index.css" />
        <title>영화 리뷰</title>
      </head>
      <body>
        ${renderHome(movies)}
      </body>
    </html>
  `;

  res.send(html);
});

app.get("/detail/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const [{ results: movies }, movieDetail] = await Promise.all([
    moviesApi.getPopular(),
    moviesApi.getDetail(Number(id)),
  ]);

  const html = /* html */ `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/styles/index.css" />
        <title>${movieDetail.title}</title>
      </head>
      <body>
        ${renderHome(movies)}
        ${renderModal(movieDetail)}
      </body>
    </html>
  `;

  res.send(html);
});

// public 폴더 속 정적 파일을 웹에서 접근할 수 있도록 만든다.
app.use(express.static(path.join(__dirname, "../public")));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
