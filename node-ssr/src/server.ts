import dotenv from "dotenv";
dotenv.config();

import express, { type Request, type Response } from "express";
import path from "node:path";

import { moviesApi } from "./service/tmdbApi";
import { createMetaTags } from "./util/createMetaTags";

const app = express();
const PORT = 8080;

app.use(express.json());

app.get("/", async (_req: Request, res: Response) => {
	const data = await moviesApi.getPopular();
	const movieListHTML = data.results
		.slice(0, 12)
		.map(
			(movie) => `
      <li class="movie-item">
        <div class="item">
          <a href="/movie/${movie.id}">
            <img
              class="thumbnail"
              src="https://media.themoviedb.org/t/p/w440_and_h660_face${movie.poster_path}"
              alt="${movie.title}"
              loading="lazy"
            />
          </a>
          <div class="item-desc">
            <p class="rate">
              <img src="/images/star_empty.png" class="star" />
              <span>${movie.vote_average.toFixed(1)}</span>
            </p>
            <strong>${movie.title}</strong>
          </div>
        </div>
      </li>
    `,
		)
		.join("");

	const topMovie = data.results[0];
	res.send(/*html*/ `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/styles/index.css" />
        <title>영화 리뷰 - 지금 가장 인기 있는 영화</title>
        ${createMetaTags({
					title: "영화 리뷰 - 지금 가장 인기 있는 영화",
					description:
						"지금 가장 인기 있는 영화를 만나보세요. TMDB 데이터를 기반으로 최신 평점과 줄거리를 제공합니다.",
					url: "https://movie-review.com/",
					image: `https://image.tmdb.org/t/p/original${topMovie.poster_path}`,
				})}
      </head>
      <body>
        <div id="wrap">
          <header>
            <div class="background-container"
              style="background-image: url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${topMovie.backdrop_path});">
              <div class="overlay"></div>
              <div class="top-rated-container">
                <img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" />
                <div class="top-rated-movie">
                  <div class="rate">
                    <img src="/images/star_empty.png" width="32" height="32" />
                    <span class="text-2xl font-semibold text-yellow">${topMovie.vote_average.toFixed(1)}</span>
                  </div>
                  <h1 class="text-3xl font-semibold">${topMovie.title}</h1>
                  <a href="/movie/${topMovie.id}" class="primary detail">자세히 보기</a>
                </div>
              </div>
            </div>
          </header>
          <main>
            <section class="container">
              <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
              <ul class="thumbnail-list">
                ${movieListHTML}
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
	const id = Number(req.params.id);
	const movieDetail = await moviesApi.getDetail(Number(id));
	const genres = movieDetail.genres.map((g) => g.name).join(" ");

	res.send(
		/*html*/
		`
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/styles/index.css" />
        <title>${movieDetail.title}</title>
        ${createMetaTags({
					title: movieDetail.title,
					description: movieDetail.overview,
					url: `https://movie-review.com/detail/${movieDetail.id}`,
					image: `https://image.tmdb.org/t/p/original${movieDetail.poster_path}`,
				})}
      </head>
      <body>
        <div class="modal-background active">
          <div class="modal">
            <div class="modal-header">
              <h1 class="modal-title">${movieDetail.title}</h1>
              <a href="/"><img src="/images/modal_button_close.png" width="24" height="24" alt="닫기" /></a>
            </div>
            <div class="modal-container">
              <img src="https://image.tmdb.org/t/p/original${movieDetail.poster_path}" alt="${movieDetail.title}" class="modal-image" />
              <div class="modal-description">
                <div class="movie-info-line">
                  <span class="movie-meta">${genres}</span>
                  <div class="movie-rating">
                    <img src="/images/star_filled.png" width="16" height="16" />
                    <span class="rating-value">${movieDetail.vote_average.toFixed(1)}</span>
                  </div>
                </div>
                <div class="overview-section">
                  <p class="overview-text">${movieDetail.overview}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
    `,
	);
});

// public 폴더 속 정적 파일을 웹에서 접근할 수 있도록 만든다.
app.use(express.static(path.join(__dirname, "../public")));

app.listen(PORT, (): void => {
	console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
	console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
