import "dotenv/config";

import axios from "axios";
import express from "express";
import path from "path";
import { moviesApi } from "./service/tmdbApi";
import { renderDetailPage, renderHomePage } from "./view";

const app = express();
const PORT = Number(process.env.PORT) || 8080;

app.get("/", async (_req, res) => {
  try {
    const { results } = await moviesApi.getPopular();
    res.type("html").send(renderHomePage(results));
  } catch (error) {
    console.error("인기 영화 조회 실패:", error);
    res.status(502).type("html").send("영화 정보를 불러오는데 실패했습니다.");
  }
});

app.get("/detail/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id <= 0) {
    res.status(404).send("영화를 찾을 수 없습니다.");
    return;
  }

  try {
    const [popular, movie] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(id),
    ]);
    res.type("html").send(renderDetailPage(popular.results, movie));
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      res.status(404).send("영화를 찾을 수 없습니다.");
      return;
    }
    console.error("영화 상세 조회 실패:", error);
    res.status(502).type("html").send("영화 정보를 불러오는데 실패했습니다.");
  }
});

app.use(express.static(path.join(__dirname, "../public"), { index: false }));

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
  });
}

export default app;
