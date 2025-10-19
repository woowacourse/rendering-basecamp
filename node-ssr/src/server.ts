import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import path from "path";
import DetailPage from "./page/detail";
import ErrorPage from "./page/error";
import Home from "./page/home";
import { moviesApi } from "./service/tmdbApi";
import { MovieResponse } from "./service/types";
import getModal from "./utils/getModal";
import { getMoviesCard } from "./utils/getMoviesCard";
import getTopRatedMovieCard from "./utils/getTopRatedMovieCard";

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

app.get("/detail/:id", async (req: Request, res: Response) => {
  const movieId = req.params.id;
  try {
    const movieList: MovieResponse = await moviesApi.getPopular(1);

    const modalComponent = await getModal({ movieId });

    const moviesComponent = await getMoviesCard({ movieList });
    const topRatedMovieComponent = getTopRatedMovieCard({ movieList });

    res.send(
      DetailPage({
        topRatedMovieComponent,
        moviesComponent,
        modalComponent,
      })
    );
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
