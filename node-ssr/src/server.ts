import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import path from "path";
import { moviesApi } from "./service/tmdbApi";
import { renderDetailPage, renderHomePage } from "./templates";

const app = express();
const PORT = Number(process.env.PORT) || 8080;

app.use(express.json());

app.get("/", async (_req: Request, res: Response) => {
  try {
    const { results } = await moviesApi.getPopular();
    res.send(renderHomePage(results));
  } catch (error) {
    console.error(error);
    res.status(500).send("영화 목록을 불러오지 못했습니다.");
  }
});

app.get("/detail/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(404).send("존재하지 않는 영화입니다.");
    return;
  }

  const [popular, detail] = await Promise.allSettled([
    moviesApi.getPopular(),
    moviesApi.getDetail(id),
  ]);

  if (detail.status === "rejected") {
    console.error(detail.reason);
    res.status(404).send("영화 정보를 불러오지 못했습니다.");
    return;
  }

  const movies = popular.status === "fulfilled" ? popular.value.results : [];
  res.send(renderDetailPage(movies, detail.value));
});

// public 폴더 속 정적 파일을 웹에서 접근할 수 있도록 만든다.
app.use(express.static(path.join(__dirname, "../public")));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
