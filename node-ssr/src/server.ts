import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import path from "path";
import { moviesApi } from "./service/tmdbApi";
import { Movie, MovieResponse } from "./service/types";

const app = express();
const PORT = 8080;

app.use(express.json());

app.get("/", async (_req: Request, res: Response) => {
  try {
    const movieList: MovieResponse = await moviesApi.getPopular(1);

    const moviesComponent = movieList.results
      .map((movie: Movie) => {
        const { title, poster_path, vote_average } = movie;
        const imageUrl = poster_path
          ? `https://image.tmdb.org/t/p/w500${poster_path}`
          : "/images/no_image.png";
        return /* html */ `
          <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src=${imageUrl} alt=${title} loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>${vote_average.toFixed(1)}</span>
                  </p>
                  <strong>${title}</strong>
                </div>
              </div>
            </li>
  `;
      })
      .join("");

    const topRatedMovie = movieList.results.reduce((prev, current) => {
      return prev.vote_average > current.vote_average ? prev : current;
    });

    const topRatedMovieComponent = /* html */ `
      <div class="background-container" style="background-image: url(https://image.tmdb.org/t/p/w500${
        topRatedMovie.poster_path
      });">
          <div class="overlay"></div>
          <div class="top-rated-container">
            <img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" />
            <div class="top-rated-movie">
              <div class="rate">
                <img src="/images/star_empty.png" width="32" height="32" />
                <span class="text-2xl font-semibold text-yellow">${topRatedMovie.vote_average.toFixed(
                  1
                )}</span>
              </div>
              <h1 class="text-3xl font-semibold">${topRatedMovie.title}</h1>
              <button class="primary detail">자세히 보기</button>
            </div>
          </div>
        </div>
    `;

    res.send(/* html */ `
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
              ${topRatedMovieComponent}
            </header>
            <main>
              <section class="container">
                <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
                <ul class="thumbnail-list">
                ${moviesComponent}
                </ul>
              </section>
            </main>
            <footer class="footer">
              <p>&copy; 우아한테크코스 All Rights Reserved.</p>
              <p><img src="/images/woowacourse_logo.png" width="180" alt="우아한테크코스" /></p>
            </footer>
          </div>
        </body>
`);
  } catch (error) {
    console.error("Error processing movie data:", error);
    res.status(500).send("서버 오류가 발생했습니다.");
  }
});

app.use(express.static(path.join(__dirname, "../public")));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
