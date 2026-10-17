import { Router, Request, Response } from "express";
import { tmdbApi } from "../api/tmdb";
import { renderDocument } from "../renderDocument";
import { renderNotFoundPage } from "../errorPages";
import { parseMovieId } from "./parseMovieId";

const router = Router();

const getPopularMoviesOrEmpty = async () => {
  try {
    return await tmdbApi.getPopularMovies();
  } catch (error) {
    console.error("인기 영화 목록을 불러오지 못해 빈 목록으로 그립니다.", error);
    return [];
  }
};

router.get("/", async (_req: Request, res: Response) => {
  const movies = await tmdbApi.getPopularMovies();

  res.send(renderDocument({ name: "home", props: { movies } }));
});

router.get("/detail/:id", async (req: Request<{ id: string }>, res: Response) => {
  const movieId = parseMovieId(req.params.id);
  if (movieId === null) {
    res.status(404).send(renderNotFoundPage());
    return;
  }

  const [movie, movies] = await Promise.all([
    tmdbApi.findMovieDetail(movieId),
    getPopularMoviesOrEmpty(),
  ]);
  if (movie === null) {
    res.status(404).send(renderNotFoundPage());
    return;
  }

  res.send(renderDocument({ name: "detail", props: { movies, movie } }));
});

export default router;
