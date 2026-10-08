import "dotenv/config";

import express, { Request, Response } from "express";
import path from "path";
import { moviesApi } from "./service/tmdbApi";
import { renderLayout, renderMessagePage } from "./views/layout";
import { renderHome } from "./views/home";
import { TMDB_IMAGE_URL } from "./views/constants";
import { renderModal } from "./views/modal";
import { isAxiosError } from "axios";

const app = express();
const PORT = Number(process.env.PORT) || 8080;

app.use(express.json());

app.get("/", async (_req: Request, res: Response) => {
  try {
    const { results: movies } = await moviesApi.getPopular();

    res.send(
      renderLayout({
        title: "영화 리뷰",
        description: "지금 인기 있는 영화를 확인하고 별점을 남겨보세요.",
        body: renderHome(movies),
      }),
    );
  } catch {
    res
      .status(500)
      .send(renderMessagePage("영화 정보를 불러오는데 실패했습니다."));
  }
});

app.get("/detail/:id", async (req: Request, res: Response) => {
  const movieId = Number(req.params.id);

  if (!Number.isInteger(movieId) || movieId < 1) {
    res.status(404).send(renderMessagePage("존재하지 않는 영화입니다."));
    return;
  }

  try {
    const [{ results: movies }, movie] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(movieId),
    ]);

    res.send(
      renderLayout({
        title: `${movie.title} - 영화 리뷰`,
        description: movie.overview || `${movie.title}의 정보를 확인해 보세요.`,
        ogTitle: movie.title,
        ogImage: movie.poster_path
          ? `${TMDB_IMAGE_URL}/w500${movie.poster_path}`
          : undefined,
        body: renderHome(movies) + renderModal(movie),
      }),
    );
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      res.status(404).send(renderMessagePage("존재하지 않는 영화입니다."));
      return;
    }

    res
      .status(500)
      .send(renderMessagePage("영화 정보를 불러오는데 실패했습니다."));
  }
});

// public 폴더 속 정적 파일을 웹에서 접근할 수 있도록 만든다.
// 위의 라우트들보다 아래에 있어야 "/" 요청에 public/index.html(예시 데이터)이 응답되지 않는다.
app.use(express.static(path.join(__dirname, "../public")));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
