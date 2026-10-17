import { ErrorRequestHandler, Router, Request, Response } from "express";
import { tmdbApi } from "../api/tmdb";
import { parseMovieId } from "./parseMovieId";

const apiRouter = Router();

apiRouter.get("/movies/:id", async (req: Request<{ id: string }>, res: Response) => {
  const movieId = parseMovieId(req.params.id);
  const movie = movieId === null ? null : await tmdbApi.findMovieDetail(movieId);
  if (movie === null) {
    res.status(404).json({ message: "영화를 찾을 수 없어요." });
    return;
  }

  res.json(movie);
});

const handleApiError: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error("TMDB 요청에 실패했습니다.", error);
  res.status(502).json({ message: "영화 정보를 불러오지 못했어요." });
};

apiRouter.use(handleApiError);

export default apiRouter;
