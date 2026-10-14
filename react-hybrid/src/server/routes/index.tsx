import { Router } from "express";
import { moviesApi } from "../api/movies";
import { renderPage } from "../render";

const router = Router();

router.get("/", async (_req, res) => {
  const { data } = await moviesApi.getPopular();
  res.send(renderPage({ movies: data.results }));
});

router.get("/detail/:id", async (req, res) => {
  const rawId = req.params.id;
  const id = Number(rawId);

  if (!/^[0-9]+$/.test(rawId) || !Number.isSafeInteger(id) || id <= 0) {
    res.status(400).send("<h1>올바른 영화 ID가 아닙니다.</h1>");
    return;
  }

  const [popularResponse, detailResponse] = await Promise.all([
    moviesApi.getPopular(),
    moviesApi.getDetail(id),
  ]);

  res.send(renderPage({
    movies: popularResponse.data.results,
    detailMovie: detailResponse.data,
  }));
});

export default router;
