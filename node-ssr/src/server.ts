import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import path from 'path';
import { moviesApi } from './service/tmdbApi';
import { Movie, MovieDetail } from './service/types';

const app = express();
const PORT = 8080;

app.use(express.json());

const createMovieListElement = (results: Movie[]) =>
  results
    .map(
      ({ title, poster_path, vote_average }) => /*html*/ `
    <li class="movie-item">
      <div class="item">
        <img class="thumbnail"
          src="${
            poster_path
              ? `https://media.themoviedb.org/t/p/w440_and_h660_face${poster_path}`
              : '/images/no_image.png'
          }"
          alt="${title}" loading="lazy" />
        <div class="item-desc">
          <p class="rate">
            <img src="/images/star_empty.png" class="star" />
            <span>${vote_average.toFixed(1)}</span>
          </p>
          <strong>${title}</strong>
        </div>
      </div>
    </li>
  `,
    )
    .join('');

const createHomeElement = (results: Movie[]) => /*html*/ `
      <div id="wrap">
        <header>
          <div class="background-container"
            style="background-image: url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${results[0].backdrop_path});">
            <div class="overlay"></div>
            <div class="top-rated-container">
              <img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" />
              <div class="top-rated-movie">
                <div class="rate">
                  <img src="/images/star_empty.png" width="32" height="32" />
                  <span class="text-2xl font-semibold text-yellow">7.7</span>
                </div>
                <h1 class="text-3xl font-semibold">${results[0].title}</h1>
                <button class="primary detail">자세히 보기</button>
              </div>
            </div>
          </div>
        </header>
        <main>
          <section class="container">
            <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
            <ul class="thumbnail-list">
              ${createMovieListElement(results)}
            </ul>
          </section>
        </main>
        <footer class="footer">
          <p>&copy; 우아한테크코스 All Rights Reserved.</p>
          <p><img src="/images/woowacourse_logo.png" width="180" alt="우아한테크코스" /></p>
        </footer>
      </div>
`;

const createModalElement = ({
  title,
  poster_path,
  genres,
  vote_average,
  overview,
}: MovieDetail) => /*html*/ `
    <div class="modal-background active">
      <div class="modal">
        <!-- 모달 헤더 -->
        <div class="modal-header">
          <h1 class="modal-title">${title}</h1>
          <img src="/images/modal_button_close.png" width="24" height="24" class="modal-close-btn" alt="Close" />
        </div>

        <div class="modal-container">
          <img src="${
            poster_path
              ? `https://image.tmdb.org/t/p/original${poster_path}`
              : '/images/no_image.png'
          }" alt="${title}" class="modal-image" />
          <div class="modal-description">
            <!-- 영화 정보 섹션 -->
            <div class="movie-info-line">
              <span class="movie-meta">${genres.map((genre) => genre.name).join(', ')}</span>
              <div class="movie-rating">
                <img src="/images/star_filled.png" width="16" height="16" />
                <span class="rating-value">${vote_average.toFixed(1)}</span>
              </div>
            </div>

            <!-- 줄거리 -->
            <div class="overview-section">
              <p class="overview-text">
                ${overview || '줄거리 정보가 없습니다.'}
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
                  <span class="rating-text">0 별점을 남겨주세요</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
`;

app.get('/', async (_req: Request, res: Response) => {
  const { results } = await moviesApi.getPopular();

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
      ${createHomeElement(results)}
    </body>

    </html>
        `);
});

app.get('/detail/:id', async (_req: Request, res: Response) => {
  const movieId = Number(_req.params.id);
  const protocol = _req.get('x-forwarded-proto') ?? _req.protocol;
  const origin = `${protocol}://${_req.get('host')}`;

  const { results } = await moviesApi.getPopular();
  const movieDetail = await moviesApi.getDetail(movieId);
  const imageUrl = movieDetail.poster_path
    ? `https://image.tmdb.org/t/p/original${movieDetail.poster_path}`
    : `${origin}/images/no_image.png`;

  res.send(/*html*/ `
        <!DOCTYPE html>
    <html lang="ko">

    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="${movieDetail.title}" />
      <meta property="og:description" content="${movieDetail.overview}" />
      <meta property="og:image" content=${imageUrl} />
      <link rel="stylesheet" href="/styles/index.css" />
      <title>영화 리뷰</title>
    </head>

    <body>
      ${createHomeElement(results)}
      ${createModalElement(movieDetail)}
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
