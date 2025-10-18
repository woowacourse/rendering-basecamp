import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import path from "path";
import { moviesApi } from "./service/tmdbApi";
// import { renderHomePage, renderDetailPage } from "./renderer/htmlRenderer";

const app = express();
const PORT = 8080;

app.use(express.json());

app.get("/", async (_req: Request, res: Response) => {
  try {
    const movieData = await moviesApi.getPopular();
    res.json(movieData);
    // const html = await renderHomePage(movieData.results);
    // res.send(html);
  } catch (error) {
    res.status(500).send("서버 오류가 발생했습니다.");
  }
});

app.get("/detail/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const movieDetail = await moviesApi.getDetail(id);
    res.json(movieDetail);
    // const html = await renderDetailPage(movieDetail);
    // res.send(html);
  } catch (error) {
    res.status(500).send("서버 오류가 발생했습니다.");
  }
});

// public 폴더 속 정적 파일을 웹에서 접근할 수 있도록 만든다.
app.use(express.static(path.join(__dirname, "../public")));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
