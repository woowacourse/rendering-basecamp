import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import { readFileSync } from 'fs';
import path from 'path';
import { moviesApi } from './service/tmdbApi';
import { Movie, MovieDetail } from './service/types';

const app = express();
const PORT = 8080;

const pageTemplate = readFileSync(
  path.join(__dirname, '../public/index.html'),
  'utf-8',
);

const renderPage = ({
  headerHtml,
  mainHtml,
  modalHtml = '',
}: {
  headerHtml: string;
  mainHtml: string;
  modalHtml?: string;
}) => {
  return pageTemplate
    .replace('<!-- HEADER -->', () => headerHtml)
    .replace('<!-- MAIN -->', () => mainHtml)
    .replace('<!-- MODAL -->', () => modalHtml);
};

app.use(express.json());

const createHeaderHtml = (movie: Movie) => {
  const title = movie.title;
  const rating = movie.vote_average.toFixed(1);

  const imagePath = movie.poster_path;
  const backgroundImageUrl = imagePath
    ? `https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${imagePath}`
    : '/images/no_image.png';

  return /*html*/ `
    <header>
      <div
        class="background-container"
        style="background-image: url('${backgroundImageUrl}');"
      >
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
                alt="평점"
              />
              <span class="text-2xl font-semibold text-yellow">
                ${rating}
              </span>
            </div>

            <h1 class="text-3xl font-semibold">${title}</h1>

            <button
              type="button"
              class="primary detail"
              data-movie-id="${movie.id}"
            >
              자세히 보기
            </button>
          </div>
        </div>
      </div>
    </header>
  `;
};

const createMainHtml = (movies: Movie[]) => {
  return /*html*/ `
        <main>
        <section class="container">
          <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
          <ul class="thumbnail-list">
            ${movies
              .map((movie) => {
                const title = movie.title;
                const rating = movie.vote_average.toFixed(1);
                const imagePath = movie.poster_path;

                return /*html*/ `
                <li class="movie-item">
                  <div class="item">
                    <img
                      class="thumbnail"
                      src="https://media.themoviedb.org/t/p/w440_and_h660_face/${imagePath}"
                      alt="${title}"
                      loading="lazy"
                    />
                    <div class="item-desc">
                      <p class="rate">
                        <img src="/images/star_empty.png" class="star" />
                        <span>${rating}</span>
                      </p>
                      <strong>${title}</strong>
                    </div>
                  </div>
                </li>
              `;
              })
              .join('')}
          </ul>
        </section>
      </main>
  `;
};

app.get('/', async (_req: Request, res: Response) => {
  const data = await moviesApi.getPopular();
  const movies = data.results;

  const headerHtml = movies[0] ? createHeaderHtml(movies[0]) : '';
  const mainHtml = createMainHtml(movies);

  res.send(renderPage({ headerHtml, mainHtml }));
});

const createModalHtml = (movieDetail: MovieDetail) => {
  const title = movieDetail.title;
  const rating = movieDetail.vote_average.toFixed(1);
  const imagePath = movieDetail.poster_path;
  const tagline = movieDetail.tagline;
  const overview = movieDetail.overview;

  return /*html*/ `
    <div class="modal-background active">
      <div class="modal">
        <!-- 모달 헤더 -->
        <div class="modal-header">
          <h1 class="modal-title">${title}</h1>
          <img src="/images/modal_button_close.png" width="24" height="24" class="modal-close-btn" alt="Close" />
        </div>

        <div class="modal-container">
          <img src="https://image.tmdb.org/t/p/original/${imagePath}" alt="${title}" class="modal-image" />
          <div class="modal-description">
            <!-- 영화 정보 섹션 -->
            <div class="movie-info-line">
              <span class="movie-meta">${tagline}</span>
              <div class="movie-rating">
                <img src="/images/star_filled.png" width="16" height="16" />
                <span class="rating-value">${rating}</span>
              </div>
            </div>

            <!-- 줄거리 -->
            <div class="overview-section">
              <p class="overview-text">
                ${overview}
              </p>
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
  `;
};

app.get('/detail/:id', async (req: Request, res: Response) => {
  const data = await moviesApi.getPopular();
  const movies = data.results;

  const movieDetail = await moviesApi.getDetail(Number(req.params.id));

  const headerHtml = createHeaderHtml(movies[0]);
  const mainHtml = createMainHtml(movies);
  const modalHtml = createModalHtml(movieDetail);

  res.send(renderPage({ headerHtml, mainHtml, modalHtml }));
});

// public 폴더 속 정적 파일을 웹에서 접근할 수 있도록 만든다.
app.use(express.static(path.join(__dirname, '../public')));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
