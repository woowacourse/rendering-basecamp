import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import path from 'path';
import { moviesApi } from './service/tmdbApi';
import { Movie } from './service/types';

const app = express();
const PORT = 8080;

app.use(express.json());

function generateMovieListHTML(movies: Movie[]): string {
  return movies
    .map(
      (movie) => `
    <li class="movie-item">
      <div class="item">
        <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face${movie.poster_path}" alt="${
        movie.title
      }" loading="lazy" />
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
    .join('');
}

app.get('/', async (_req: Request, res: Response) => {
  try {
    const moviesResponse = await moviesApi.getPopular();
    const movies = moviesResponse.results;
    const featuredMovie = movies[0];

    const html = `
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/styles/index.css" />
    <title>영화 리뷰</title>

    <meta property="og:type" content="website" />
    <meta property="og:title" content="${featuredMovie.title}" />
    <meta property="og:description" content="${featuredMovie.overview || '영화 상세 정보'}" />
    <meta property="og:image" content="https://image.tmdb.org/t/p/original${featuredMovie.poster_path}" />
    <meta property="og:url" content="http://localhost:8080" />
  </head>
  <body>
    <div id="wrap">
      <header>
        <div class="background-container" style="background-image: url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${
          featuredMovie.backdrop_path
        });">
          <div class="overlay"></div>
          <div class="top-rated-container">
            <img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" />
            <div class="top-rated-movie">
              <div class="rate">
                <img src="/images/star_empty.png" width="32" height="32" />
                <span class="text-2xl font-semibold text-yellow">${featuredMovie.vote_average.toFixed(1)}</span>
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
            ${generateMovieListHTML(movies)}
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
    `;

    res.send(html);
  } catch (error) {
    console.error('영화 목록 조회 실패:', error);
    res.status(500).send('영화 목록을 불러오는데 실패했습니다.');
  }
});

app.get('/detail/:id', async (req: Request, res: Response) => {
  try {
    const movieId = Number(req.params.id);

    const [moviesResponse, movieDetail] = await Promise.all([moviesApi.getPopular(), moviesApi.getDetail(movieId)]);

    const movies = moviesResponse.results;
    const featuredMovie = movies[0];

    const genres = movieDetail.genres.map((g) => g.name).join(', ');

    const html = `
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/styles/index.css" />
    <title>영화 리뷰 - ${movieDetail.title}</title>
  </head>
  <body>
    <div id="wrap">
      <header>
        <div class="background-container" style="background-image: url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${
          featuredMovie.backdrop_path
        });">
          <div class="overlay"></div>
          <div class="top-rated-container">
            <img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" />
            <div class="top-rated-movie">
              <div class="rate">
                <img src="/images/star_empty.png" width="32" height="32" />
                <span class="text-2xl font-semibold text-yellow">${featuredMovie.vote_average.toFixed(1)}</span>
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
            ${generateMovieListHTML(movies)}
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
          <h1 class="modal-title">${movieDetail.title}</h1>
          <img src="/images/modal_button_close.png" width="24" height="24" class="modal-close-btn" alt="Close" />
        </div>

        <div class="modal-container">
          <img src="https://image.tmdb.org/t/p/original${movieDetail.poster_path}" alt="${
      movieDetail.title
    }" class="modal-image" />
          <div class="modal-description">
            <!-- 영화 정보 섹션 -->
            <div class="movie-info-line">
              <span class="movie-meta">${genres}</span>
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
    `;

    res.send(html);
  } catch (error) {
    console.error('영화 상세 정보 조회 실패:', error);
    res.status(500).send('영화 정보를 불러오는데 실패했습니다.');
  }
});

app.use(express.static(path.join(__dirname, '../public')));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
