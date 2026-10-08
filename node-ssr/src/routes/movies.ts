import axios from "axios";
import { Request, Response, Router } from "express";
import { moviesApi } from "../service/tmdbApi";
import { getThumbnailUrl } from "../utils/imageUrl";
import { renderErrorPage } from "../views/ErrorPage";
import { renderLayout } from "../views/layout";
import { EMPTY_OVERVIEW_TEXT, renderMovieDetailModal } from "../views/MovieDetailModal";
import { renderMovieHomePage } from "../views/MovieHomePage";

const SITE_TITLE = "영화 리뷰";
const HOME_DESCRIPTION = "지금 인기 있는 영화";
const FETCH_FAILED_MESSAGE = "영화 정보를 불러오는데 실패했습니다.";
const NOT_FOUND_MESSAGE = "영화 정보를 찾을 수 없습니다.";

const MOVIE_ID_PATTERN = /^[1-9]\d*$/;

const router = Router();

const getOrigin = (req: Request) => `${req.protocol}://${req.get("host")}`;

// og:image 는 절대 URL 이어야 하므로 포스터가 없을 때 쓰는 로컬 이미지 경로에는 origin 을 붙인다.
const toAbsoluteUrl = (origin: string, url: string) =>
  url.startsWith("/") ? `${origin}${url}` : url;

const isNotFoundError = (error: unknown) =>
  axios.isAxiosError(error) && error.response?.status === 404;

// axios 에러 객체에는 Authorization 헤더가 포함되어 있으므로 메시지만 남긴다.
const logError = (error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
};

router.get("/", async (req: Request, res: Response) => {
  try {
    const { results: movies } = await moviesApi.getPopular();

    if (movies.length === 0) {
      res.send(renderErrorPage(FETCH_FAILED_MESSAGE));
      return;
    }

    const origin = getOrigin(req);

    res.send(
      renderLayout({
        title: SITE_TITLE,
        meta: {
          description: HOME_DESCRIPTION,
          og: {
            type: "website",
            url: `${origin}${req.path}`,
            image: toAbsoluteUrl(origin, getThumbnailUrl(movies[0].poster_path)),
          },
        },
        body: renderMovieHomePage(movies),
      })
    );
  } catch (error) {
    logError(error);
    res.status(500).send(renderErrorPage(FETCH_FAILED_MESSAGE));
  }
});

router.get("/detail/:id", async (req: Request<{ id: string }>, res: Response) => {
  if (!MOVIE_ID_PATTERN.test(req.params.id)) {
    res.status(404).send(renderErrorPage(NOT_FOUND_MESSAGE));
    return;
  }

  try {
    const [{ results: movies }, movie] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(Number(req.params.id)),
    ]);

    if (movies.length === 0) {
      res.send(renderErrorPage(FETCH_FAILED_MESSAGE));
      return;
    }

    const origin = getOrigin(req);

    res.send(
      renderLayout({
        title: `${movie.title} | ${SITE_TITLE}`,
        meta: {
          description: movie.overview || EMPTY_OVERVIEW_TEXT,
          og: {
            type: "video.movie",
            url: `${origin}${req.path}`,
            image: toAbsoluteUrl(origin, getThumbnailUrl(movie.poster_path)),
          },
        },
        body: renderMovieHomePage(movies) + renderMovieDetailModal(movie),
      })
    );
  } catch (error) {
    if (isNotFoundError(error)) {
      res.status(404).send(renderErrorPage(NOT_FOUND_MESSAGE));
      return;
    }

    logError(error);
    res.status(500).send(renderErrorPage(FETCH_FAILED_MESSAGE));
  }
});

export default router;
