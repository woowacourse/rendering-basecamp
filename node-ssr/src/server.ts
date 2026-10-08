import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import axios from "axios";

import { moviesApi } from "./service/tmdbApi";
import { renderHome, renderDetail } from "./render";

if (!process.env.TMDB_ACCESS_TOKEN) {
  throw new Error("TMDB_ACCESS_TOKEN을 설정해주세요.");
}

const app = express();

const PORT = Number(process.env.PORT ?? 8080);

const publicBaseUrl = process.env.PUBLIC_BASE_URL ?? `http://localhost:${PORT}`;

// CSS와 이미지 파일 제공
app.use(
  express.static(path.join(__dirname, "../public"), {
    index: false,
  }),
);

// 목록 페이지
app.get("/", async (_req, res) => {
  const data = await moviesApi.getPopular();

  const html = renderHome(data.results);

  res.type("html").send(html);
});

// 상세 페이지
app.get("/detail/:id", async (req, res) => {
  const rawId = req.params.id;
  const id = Number(rawId);

  if (!/^\d+$/.test(rawId) || !Number.isSafeInteger(id) || id <= 0) {
    res.status(400).send("올바른 영화 ID를 입력해주세요.");
    return;
  }

  const movie = await moviesApi.getDetail(id);

  const html = renderDetail(movie, publicBaseUrl);

  res.type("html").send(html);
});

// 등록되지 않은 주소
app.use((_req, res) => {
  res.status(404).send("페이지를 찾을 수 없습니다.");
});

// 요청 처리 중 발생한 오류
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error instanceof Error ? error.message : "알 수 없는 오류");

  const status = axios.isAxiosError(error)
    ? error.response?.status === 404
      ? 404
      : 502
    : 500;

  res
    .status(status)
    .send(
      status === 404
        ? "영화를 찾을 수 없습니다."
        : "페이지를 불러오지 못했습니다.",
    );
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`http://localhost:${PORT}`);
});

export default app;
