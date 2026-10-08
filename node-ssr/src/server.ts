import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import path from "path";
import axios from "axios";
import { moviesApi } from "./service/tmdbApi";
import { renderPage, stylesheet } from "./render";

const app = express();
const PORT = Number(process.env.PORT) || 8080;

// 배포 서비스의 프록시 뒤에서도 HTTPS URL을 생성한다.
app.set("trust proxy", 1);

function getOrigin(req: Request): string {
  return new URL(process.env.SITE_URL || `${req.protocol}://${req.get("host")}`).origin;
}

function sendApiError(error: unknown, res: Response): void {
  const isNotFound = axios.isAxiosError(error) && error.response?.status === 404;
  // Axios 오류 전체에는 인증 헤더가 포함될 수 있어 출력하지 않는다.
  console.error(isNotFound ? "영화를 찾을 수 없습니다." : "TMDB 영화 조회에 실패했습니다.");
  res.status(isNotFound ? 404 : 502).type("html").send(
    `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><title>영화 리뷰</title></head><body><h1>${isNotFound ? "영화를 찾을 수 없습니다." : "영화 정보를 불러오지 못했습니다."}</h1><a href="/">홈으로</a></body></html>`
  );
}

app.get("/", async (req: Request, res: Response) => {
  try {
    const apiStarted = performance.now();
    const { results } = await moviesApi.getPopular();
    res.set("Server-Timing", `tmdb;dur=${(performance.now() - apiStarted).toFixed(1)}`);
    res.type("html").send(renderPage(results, getOrigin(req)));
  } catch (error) {
    sendApiError(error, res);
  }
});

app.get("/detail/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!/^\d+$/.test(String(req.params.id)) || !Number.isSafeInteger(id) || id <= 0) {
    res.status(400).send("올바른 영화 ID를 입력해주세요.");
    return;
  }

  try {
    const apiStarted = performance.now();
    const [popular, detail] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(id),
    ]);
    res.set("Server-Timing", `tmdb;dur=${(performance.now() - apiStarted).toFixed(1)}`);
    res.type("html").send(renderPage(popular.results, getOrigin(req), detail));
  } catch (error) {
    sendApiError(error, res);
  }
});

// HTML 템플릿 대신 CSS와 이미지만 정적 파일로 제공한다.
const publicDirectory = path.join(__dirname, "../public");
app.get("/styles/index.css", (_req: Request, res: Response) => {
  res.type("css").send(stylesheet);
});
app.use("/styles", express.static(path.join(publicDirectory, "styles")));
app.use("/images", express.static(path.join(publicDirectory, "images")));

app.listen(PORT, "0.0.0.0", (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
