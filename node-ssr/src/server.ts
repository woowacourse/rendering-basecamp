import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import path from "path";
import { moviesApi } from "./service/tmdbApi";
import { html } from "./service/html";

const app = express();
const PORT = 8080;

app.use(express.json());

app.get("/", async (_req: Request, res: Response) => {
  try {
    const movies = (await moviesApi.getPopular()).results;

    res.send(html.mainHtml(movies));
  } catch (error) {
    console.error(error);
    res.status(500).send("서버 오류가 발생했습니다.");
  }
});

app.get("/detail/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const movie = await moviesApi.getDetail(id);

    res.send(html.detailHtml(movie));
  } catch (error) {
    console.error(error);
    res.status(500).send("영화 상세 정보를 불러오는 데 실패했습니다.");
  }
});

// public 폴더 속 정적 파일을 웹에서 접근할 수 있도록 만든다.
app.use(express.static(path.join(__dirname, "../public")));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
