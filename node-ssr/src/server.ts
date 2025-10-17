import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import path from "path";
import { moviesApi } from "./service/tmdbApi";
import { generateMetaTemplate } from "./service/generateMetaTemplate";
import { getCurrentUrlByRequest } from "./service/getCurrentUrlByRequest";

const app = express();
const PORT = 8080;

app.use(express.json());

app.get("/", async (_req: Request, res: Response) => {
  const metaTemplate = generateMetaTemplate({
    currentUrl: getCurrentUrlByRequest(_req),
  });

  res.send(/*html*/ `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        ${metaTemplate}
      </head>
      <body>
        메인 페이지
      </body>
    </html>
        `);
});

app.get("/detail/:id", async (_req: Request, res: Response) => {
  const movieId = Number(_req.params.id);
  const movieDetail = await moviesApi.getDetail(movieId);

  const imageUrl = movieDetail.poster_path
    ? `https://image.tmdb.org/t/p/original${movieDetail.poster_path}`
    : "/images/no_image.png";

  const metaTemplate = generateMetaTemplate({
    title: movieDetail.title,
    description: movieDetail.overview,
    image: { url: imageUrl, alt: movieDetail.title },
    currentUrl: getCurrentUrlByRequest(_req),
  });

  res.send(/*html*/ `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        ${metaTemplate}
      </head>
      <body>
        상세 페이지
      </body>
    </html>
        `);
});

// public 폴더 속 정적 파일을 웹에서 접근할 수 있도록 만든다.
app.use(express.static(path.join(__dirname, "../public")));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
