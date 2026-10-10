import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import path from "path";
import { moviesApi } from "./service/tmdbApi";
import { renderHomePage } from "./view/pageRenderer";

const app = express();
const PORT = 8080;

app.use(express.json());

app.get("/", async (_req: Request, res: Response) => {
  try {
    const popularMovies = await moviesApi.getPopular();

    res.type("html").send(renderHomePage(popularMovies.results));
  } catch {
    res
      .status(502)
      .type("text")
      .send("영화 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
  }
});

// public 폴더 속 정적 파일을 웹에서 접근할 수 있도록 만든다.
app.use(express.static(path.join(__dirname, "../public")));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
