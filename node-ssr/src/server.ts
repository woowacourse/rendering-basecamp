import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import path from "path";
import DetailPage from "./page/detail";
import ErrorPage from "./page/error";
import Home from "./page/home";
import { moviesApi } from "./service/tmdbApi";
import { MovieDetailResponse, MovieResponse } from "./service/types";
import getModal from "./utils/getModal";
import { getMoviesCard } from "./utils/getMoviesCard";
import getTopRatedMovieCard from "./utils/getTopRatedMovieCard";
import { SeoHead } from "./components/SeoHead";

const app = express();
const PORT = 8080;

app.use(express.json());

app.get("/", async (_req: Request, res: Response) => {
  try {
    const movieList: MovieResponse = await moviesApi.getPopular(1);

    const moviesComponent = await getMoviesCard({ movieList });
    const topRatedMovieComponent = getTopRatedMovieCard({ movieList });

    const seoHead = SeoHead({
      title: "인기 영화 추천",
      description: "지금 인기 있는 영화들을 만나보세요.",
      image: `https://image.tmdb.org/t/p/w1280${movieList.results[0].backdrop_path}`,
      url: "https://rendering-basecamp-production-8f18.up.railway.app/",
    });

    res.send(Home({ topRatedMovieComponent, moviesComponent, seoHead }));
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
    const movieDetail: MovieDetailResponse = await moviesApi.getDetail(
      Number(movieId)
    );

    const modalComponent = await getModal({ movieDetail });

    const moviesComponent = await getMoviesCard({ movieList });
    const topRatedMovieComponent = getTopRatedMovieCard({ movieList });

    const seoHead = SeoHead({
      title: movieDetail.title,
      description: movieDetail.overview,
      image: `https://image.tmdb.org/t/p/w1280${movieDetail.backdrop_path}`,
      url: `https://rendering-basecamp-production-8f18.up.railway.app/detail/${movieDetail.id}`,
    });

    res.send(
      DetailPage({
        seoHead,
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
