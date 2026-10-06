import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import path from 'path';
import { moviesApi } from './service/tmdbApi';
import type { Movie } from './service/types';

const app = express();
const PORT = 8080;

app.use(express.json());

const renderHeader = (featuredMovie: Movie) => {
  const backdropImageUrl = featuredMovie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${featuredMovie.backdrop_path}`
    : '/images/no_image.png';

  return /*html*/ `
    <header>
      <div
        class="background-container"
        style="background-image: url(${backdropImageUrl});"
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
  `;
};

const renderMain = (movies: Movie[]) => {
  const movieItems = movies
    .map((movie) => {
      const posterImageUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : '/images/no_image.png';

      return /*html*/ `
          <li class="movie-item" data-index="${movie.id}">
            <div class="item">
              <img
                class="thumbnail"
                src="${posterImageUrl}"
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
        `;
    })
    .join('');

  return /*html*/ `
    <main>
      <section class="container">
        <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
        <ul class="thumbnail-list">
          ${movieItems}
        </ul>
      </section>
    </main>
  `;
};

const renderFooter = () => /*html*/ `
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
`;

app.get('/', async (_req: Request, res: Response) => {
  const { results: movies } = await moviesApi.getPopular();
  const featuredMovie = movies[0];

  res.send(/*html*/ `
    <!doctype html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/styles/index.css" />
        <title>영화 리뷰</title>
      </head>
      <body>
        <div id="wrap">
          ${renderHeader(featuredMovie)}
          ${renderMain(movies)}
          ${renderFooter()}
        </div>
      </body>
    </html>
  `);
});

// public 폴더 속 정적 파일을 웹에서 접근할 수 있도록 만든다.
app.use(express.static(path.join(__dirname, '../public')));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
