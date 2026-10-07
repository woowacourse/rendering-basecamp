import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import path from "path";

import { moviesApi } from "./service/tmdbApi";

const app = express();
const PORT = 8080;

app.use(express.json());

app.set("view engine", "ejs");
app.set("views", "./src/views");

app.get("/", async (_req: Request, res: Response) => {
  const data = await moviesApi.getPopular();

  res.render("index", { movies: data.results });
});

app.get("/detail/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  const moviesData = await moviesApi.getPopular();
  const movieDetail = await moviesApi.getDetail(Number(id));

  res.render("detail", { movies: moviesData.results, movie: movieDetail });
});

// public 폴더 속 정적 파일을 웹에서 접근할 수 있도록 만든다.
app.use(express.static(path.join(__dirname, "../public")));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
