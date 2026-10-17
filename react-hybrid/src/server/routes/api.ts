import { Router, Request, Response } from "express";
import { tmdbApi } from "../api/tmdb";

const apiRouter = Router();

apiRouter.get("/movies/:id", async (req: Request<{ id: string }>, res: Response) => {
  const { data } = await tmdbApi.getDetail(Number(req.params.id));

  res.json(data);
});

export default apiRouter;
