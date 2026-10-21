import { Router, Request, Response } from "express";
import { isAxiosError } from "axios";
import { homeController } from "../controllers/homeController";
import { movieDetailController, parseMovieId } from "../controllers/movieDetailController";
import { notFoundController } from "../controllers/errorController";
import type { PageResponse } from "../controllers/types";
import { getMovieDetail } from "../tmdb";

const router = Router();

const send = (res: Response, { status, html }: PageResponse) => {
  res.status(status).type("html").send(html);
};

router.get("/", async (_: Request, res: Response) => {
  send(res, await homeController());
});

router.get("/detail/:id", async (req: Request<{ id: string }>, res: Response) => {
  send(res, await movieDetailController(req.params.id));
});

// 브라우저에서 모달을 열 때 사용한다. 서버의 상세 캐시를 그대로 재사용한다.
router.get("/api/movies/:id", async (req: Request<{ id: string }>, res: Response) => {
  const movieId = parseMovieId(req.params.id);
  if (movieId === null) {
    res.status(404).json({ message: "영화를 찾을 수 없습니다." });
    return;
  }

  try {
    res.json(await getMovieDetail(movieId));
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      res.status(404).json({ message: "영화를 찾을 수 없습니다." });
      return;
    }
    console.error(error);
    res.status(500).json({ message: "영화 정보를 불러오는 중 문제가 발생했습니다." });
  }
});

router.use((_: Request, res: Response) => {
  send(res, notFoundController());
});

export default router;
