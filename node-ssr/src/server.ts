import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import { readFile } from "node:fs/promises";
import path from "path";
import { moviesApi } from "./service/tmdbApi";

const app = express();
const PORT = Number(process.env.PORT) || 8080;

app.use(express.json());

app.get("/", async (_req: Request, res: Response) => {
  // 1. HTML 파일을 문자열로 읽기
  const template = await readFile(
    path.join(__dirname, "../public/index.html"),
    "utf-8",
  );

  // 2. API로 영화 데이터 받아오기
  // 진짜 궁금한 점: SSR에서 요청 실패했을 때 어떻게 처리해야 좋은 UX가 될까?
  const data = await moviesApi.getPopular(1);
  const movies = data.results;
  const topRatedMovie = movies[0];

  const topRatedMovieString = `
          <div
          class="background-container"
          style="
            background-image: url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/${topRatedMovie.backdrop_path});
          "
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
                <img src="/images/star_empty.png" width="32" height="32" />
                <span class="text-2xl font-semibold text-yellow">${topRatedMovie.vote_average.toFixed(1)}</span>
              </div>
              <h1 class="text-3xl font-semibold">${topRatedMovie.title}</h1>
              <button class="primary detail">자세히 보기</button>
            </div>
          </div>
        </div>
  `;

  let movieList = "";
  movies.forEach(
    (movie) =>
      (movieList += `<li class="movie-item">
              <div class="item">
                <img
                  class="thumbnail"
                  src="https://media.themoviedb.org/t/p/w440_and_h660_face${movie.poster_path}"
                  alt="${movie.title}"
                  loading="lazy"
                />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>${movie.vote_average.toFixed(1)}</span>
                  </p>
                  <strong>${movie.title}</strong>
                </div>
              </div>
            </li>`),
  );

  // 3. template에 replace로 대체하기
  const topRatedMark = "{{TOP_RATED_MOVIE}}";
  const movieListMark = "{{MOVIE_LIST}}";
  const html = template
    .replace(topRatedMark, topRatedMovieString)
    .replace(movieListMark, movieList);
  res.send(html);
});

// 영화 상세
app.get("/detail/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  // 1. HTML 파일을 문자열로 읽기
  const template = await readFile(
    path.join(__dirname, "../public/modal.html"),
    "utf-8",
  );

  // 2. API로 영화 데이터 받아오기
  const [moviesResonse, movieDetail] = await Promise.all([
    moviesApi.getPopular(1),
    moviesApi.getDetail(id),
  ]);
  const movies = moviesResonse.results;
  const topRatedMovie = movies[0];

  // 영화 상세 OG
  const movieDetailOgString = `
        <title>${movieDetail.title}</title>
        <meta property="og:title" content="${movieDetail.title}" />
        <meta property="og:description" content="${movieDetail.overview}" />
        <meta name="description" content="${movieDetail.overview}" />
        ${
          movieDetail.poster_path
            ? `<meta
            property="og:image"
            content="https://image.tmdb.org/t/p/original${movieDetail.poster_path}"
          />`
            : ""
        }`;

  // 헤더 영화
  const topRatedMovieString = `
          <div
          class="background-container"
          style="
            background-image: url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/${topRatedMovie.poster_path});
          "
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
                <img src="/images/star_empty.png" width="32" height="32" />
                <span class="text-2xl font-semibold text-yellow">${topRatedMovie.vote_average.toFixed(1)}</span>
              </div>
              <h1 class="text-3xl font-semibold">${topRatedMovie.title}</h1>
              <button class="primary detail">자세히 보기</button>
            </div>
          </div>
        </div>
  `;

  // 인기 영화 목록
  let movieList = "";
  movies.forEach(
    (movie) =>
      (movieList += `<li class="movie-item">
              <div class="item">
                <img
                  class="thumbnail"
                  src="https://media.themoviedb.org/t/p/w440_and_h660_face/${movie.poster_path}"
                  alt="${movie.title}"
                  loading="lazy"
                />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>${movie.vote_average.toFixed(1)}</span>
                  </p>
                  <strong>${movie.title}</strong>
                </div>
              </div>
            </li>`),
  );

  // 영화 상세 모달 데이터
  const movieDetailString = `
        <div class="modal-header">
          <h1 class="modal-title">${movieDetail.title}</h1>
          <img
            src="/images/modal_button_close.png"
            width="24"
            height="24"
            class="modal-close-btn"
            alt="Close"
          />
        </div>

        <div class="modal-container">
          <img
            src="https://image.tmdb.org/t/p/original${movieDetail.poster_path}"
            alt="${movieDetail.title}"
            class="modal-image"
          />
          <div class="modal-description">
            <!-- 영화 정보 섹션 -->
            <div class="movie-info-line">
              <span class="movie-meta"
                >${movieDetail.genres.map((g) => g.name).join(", ")}</span
              >
              <div class="movie-rating">
                <img src="/images/star_filled.png" width="16" height="16" />
                <span class="rating-value">${movieDetail.vote_average.toFixed(1)}</span>
              </div>
            </div>

            <!-- 줄거리 -->
            <div class="overview-section">
              <p class="overview-text">
              ${movieDetail.overview}
              </p>
            </div>`;

  // 3. template에 replace로 대체하기
  const movieDetailOgMark = "{{MOVIE_DETAIL_OG}}";
  const topRatedMark = "{{TOP_RATED_MOVIE}}";
  const movieListMark = "{{MOVIE_LIST}}";
  const movieDetailMark = "{{MOVIE_DETAIL}}";

  const html = template
    .replace(movieDetailOgMark, movieDetailOgString)
    .replace(topRatedMark, topRatedMovieString)
    .replace(movieListMark, movieList)
    .replace(movieDetailMark, movieDetailString);

  res.send(html);
});

// public 폴더 속 정적 파일을 웹에서 접근할 수 있도록 만든다.
app.use(express.static(path.join(__dirname, "../public")));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
