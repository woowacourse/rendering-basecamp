import { Router, Request, Response } from "express";
import { moviesApi } from "../../client/api/movies";
import { renderDocument } from "../renderDocument";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  const { data } = await moviesApi.getPopular();

  res.send(renderDocument({ name: "home", props: { movies: data.results } }));
});

router.get("/detail/:id", async (req: Request<{ id: string }>, res: Response) => {
  const movieId = Number(req.params.id);
  const [popular, detail] = await Promise.all([
    moviesApi.getPopular(),
    moviesApi.getDetail(movieId),
  ]);

  res.send(
    renderDocument({
      name: "detail",
      props: { movies: popular.data.results, movie: detail.data },
    })
  );
});

export default router;
