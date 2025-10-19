import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import path from "path";
import TopRatedMovieCard from "./components/TopRatedMovieCard";
import Home from "./page/home";
import { moviesApi } from "./service/tmdbApi";
import { MovieDetailResponse, MovieResponse } from "./service/types";
import { getMoviesCard } from "./utils/getMoviesCard";
import getTopRatedMovieCard from "./utils/getTopRatedMovieCard";
import ErrorPage from "./page/error";

const app = express();
const PORT = 8080;

app.use(express.json());

app.get("/", async (_req: Request, res: Response) => {
  try {
    const movieList: MovieResponse = await moviesApi.getPopular(1);

    const moviesComponent = await getMoviesCard({ movieList });
    const topRatedMovieComponent = getTopRatedMovieCard({ movieList });

    res.send(Home({ topRatedMovieComponent, moviesComponent }));
  } catch (error) {
    console.error("Error processing movie data:", error);
    res
      .status(500)
      .send(
        ErrorPage({ message: "영화 정보를 불러오는 중 오류가 발생했습니다." })
      );
  }
});

app.get("detail/:id", async (req: Request, res: Response) => {
  const movieId = req.params.id;
  try {
    const movieDetail: MovieDetailResponse = await moviesApi.getDetail(
      Number(movieId)
    );

    const { title, overview, poster_path, vote_average } = movieDetail;

    const imageUrl = poster_path
      ? `https://image.tmdb.org/t/p/w500${poster_path}`
      : "/images/no_image.png";

    res.send(/* html */ `
      <!DOCTYPE html>
      <html lang="ko">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="stylesheet" href="/styles/index.css" />
          <title>${title} - 영화 상세 정보</title>
        </head>
        <body>
          <div id="wrap">
            <header class="detail-header">
              <h1 class="text-3xl font-bold mb-16">${title}</h1>
            </header>
            <main class="container detail-main">
              <div class="detail-content">
                <img class="detail-poster" src=${imageUrl} alt=${title} loading="lazy" />
                <div class="detail-info">
                  <p class="detail-rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>${vote_average.toFixed(1)}</span>
                  </p>
                  <p class="detail-overview">${overview}</p>
                  <button onclick="window.history.back()" class="primary back-button">뒤로 가기</button>
                </div>
              </div>
            </main>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Error fetching movie details:", error);
    res.status(500).send("서버 오류가 발생했습니다.");
  }
});

app.use(express.static(path.join(__dirname, "../public")));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
