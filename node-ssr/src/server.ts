import 'dotenv/config';
import express, {Request, Response} from 'express';
import path from 'path';
import {moviesApi} from './service/tmdbApi';
import escapeHtml from './utils/escapeHtml';

const app = express();
const PORT = 8080;
const imageBaseUrl = process.env.TMDB_IMAGE_BASE_URL ?? 'https://image.tmdb.org/t/p';

app.use(express.json());

app.get('/', async (_req: Request, res: Response) => {
	try {
		const movies = await moviesApi.getPopular();
		const mostPopularMovie = movies.results[0];

		const movieItems = movies.results
		.map(
			(movie) => `
          <li class="movie-item">
            <div class="item">
              <img class="thumbnail" src="${movie.poster_path ? `${imageBaseUrl}/w440_and_h660_face${movie.poster_path}` : '/images/no_image.png'}" alt="${escapeHtml(movie.title)}" loading="lazy" />
              <div class="item-desc">
                <p class="rate">
                  <img src="/images/star_empty.png" class="star" alt="별점" />
                  <span>${movie.vote_average.toFixed(1)}</span>
                </p>
                <strong>${escapeHtml(movie.title)}</strong>
              </div>
            </div>
          </li>`,
		)
		.join('');

		const hero = mostPopularMovie
			? `
        <div class="background-container" style="background-image: url(${mostPopularMovie.backdrop_path ? `${imageBaseUrl}/w1920_and_h800_multi_faces${mostPopularMovie.backdrop_path}` : '/images/dizzy_planet.png'});">
          <div class="overlay"></div>
          <div class="top-rated-container">
            <img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" />
            <div class="top-rated-movie">
              <div class="rate">
                <img src="/images/star_empty.png" width="32" height="32" alt="별점" />
                <span class="text-2xl font-semibold text-yellow">${mostPopularMovie.vote_average.toFixed(1)}</span>
              </div>
              <h1 class="text-3xl font-semibold">${escapeHtml(mostPopularMovie.title)}</h1>
              <a class="primary detail" href="/detail/${mostPopularMovie.id}">자세히 보기</a>
            </div>
          </div>
        </div>`
			: '<div class="background-container"><p>인기 영화를 불러오지 못했습니다.</p></div>';

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
            <header>${hero}</header>
            <main>
              <section class="container">
                <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
                <ul class="thumbnail-list">${movieItems}</ul>
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
	} catch (error) {
		console.error('인기 영화 페이지 생성 실패:', error);
		res.status(502).send('영화 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
	}
});

// public 폴더 속 정적 파일을 웹에서 접근할 수 있도록 만든다.
app.use(express.static(path.join(__dirname, '../public')));

app.listen(PORT, (): void => {
	console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
