import { Router, Request, Response } from "express";
import axios from "axios";

import { renderToString } from "react-dom/server";
import App from "../../client/App";
import React from "react";

import { tmdbApi } from "../api/tmdb";
import type { InitialData } from "../../client/types/InitialData.types";
import type { MovieItem } from "../../client/types/Movie.types";
import type { MovieDetailResponse } from "../../client/types/MovieDetail.types";

const router = Router();

const DEFAULT_TITLE = "영화 리뷰";
const DEFAULT_DESCRIPTION = "지금 인기 있는 영화를 확인하고 별점을 남겨보세요.";

function escapeHTML(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// JSON 안에 "</script>" 가 들어 있어도 스크립트 태그가 닫히지 않도록 "<" 를 이스케이프한다.
function serializeInitialData(data: InitialData) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function getOrigin(req: Request) {
  return `${req.protocol}://${req.get("host")}`;
}

function generateMetaTags(req: Request, movieDetail: MovieDetailResponse | null) {
  const url = `${getOrigin(req)}${req.originalUrl}`;

  if (movieDetail == null) {
    return /*html*/ `
      <meta name="description" content="${escapeHTML(DEFAULT_DESCRIPTION)}" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="${escapeHTML(DEFAULT_TITLE)}" />
      <meta property="og:description" content="${escapeHTML(DEFAULT_DESCRIPTION)}" />
      <meta property="og:url" content="${escapeHTML(url)}" />
      <meta property="og:image" content="${escapeHTML(`${getOrigin(req)}/images/logo.png`)}" />
    `;
  }

  const title = `${movieDetail.title} - ${DEFAULT_TITLE}`;
  const description = movieDetail.overview || DEFAULT_DESCRIPTION;
  const image = movieDetail.poster_path
    ? `https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`
    : `${getOrigin(req)}/images/no_image.png`;

  return /*html*/ `
    <meta name="description" content="${escapeHTML(description)}" />
    <meta property="og:type" content="video.movie" />
    <meta property="og:title" content="${escapeHTML(title)}" />
    <meta property="og:description" content="${escapeHTML(description)}" />
    <meta property="og:url" content="${escapeHTML(url)}" />
    <meta property="og:image" content="${escapeHTML(image)}" />
    <meta name="twitter:card" content="summary_large_image" />
  `;
}

function generateHTML({
  title,
  metaTags,
  appHTML,
  initialData,
}: {
  title: string;
  metaTags: string;
  appHTML: string;
  initialData: InitialData;
}) {
  return /*html*/ `<!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/static/styles/index.css" />
        <title>${escapeHTML(title)}</title>
        ${metaTags}
      </head>
      <body>
        <div id="root">${appHTML}</div>
        <script>
          window.__INITIAL_DATA__ = ${serializeInitialData(initialData)};
        </script>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
  `;
}

// axios 에러 객체 전체를 출력하면 요청 헤더(TMDB 토큰)까지 로그에 남기 때문에 요약만 남긴다.
function describeError(error: unknown) {
  if (axios.isAxiosError(error)) {
    return `${error.response?.status ?? "NETWORK"} ${error.message}`;
  }
  return error instanceof Error ? error.message : String(error);
}

function isNotFoundError(error: unknown) {
  return axios.isAxiosError(error) && error.response?.status === 404;
}

async function fetchPopularMovies(): Promise<MovieItem[]> {
  try {
    return await tmdbApi.getPopular();
  } catch (error) {
    console.error(`[SSR] 인기 영화 목록 조회 실패: ${describeError(error)}`);
    return [];
  }
}

async function fetchMovieDetail(id: number): Promise<MovieDetailResponse | null> {
  try {
    return await tmdbApi.getDetail(id);
  } catch (error) {
    if (!isNotFoundError(error)) {
      console.error(`[SSR] 영화 상세 조회 실패 (id: ${id}): ${describeError(error)}`);
    }
    return null;
  }
}

function render(req: Request, res: Response, initialData: InitialData) {
  const { movieDetail } = initialData;
  const appHTML = renderToString(<App initialData={initialData} />);

  const html = generateHTML({
    title: movieDetail ? `${movieDetail.title} - ${DEFAULT_TITLE}` : DEFAULT_TITLE,
    metaTags: generateMetaTags(req, movieDetail),
    appHTML,
    initialData,
  });

  res.send(html);
}

router.get("/", async (req: Request, res: Response) => {
  const movies = await fetchPopularMovies();

  render(req, res, { movies, movieDetail: null });
});

router.get("/detail/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const isValidId = Number.isInteger(id) && id > 0;

  const [movies, movieDetail] = await Promise.all([
    fetchPopularMovies(),
    isValidId ? fetchMovieDetail(id) : Promise.resolve(null),
  ]);

  if (movieDetail == null) {
    res.status(404);
  }

  render(req, res, { movies, movieDetail });
});

// 하이드레이션 이후 클라이언트에서 영화 상세를 조회할 때 사용하는 API
router.get("/api/movies/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: "잘못된 영화 ID 입니다." });
    return;
  }

  try {
    res.json(await tmdbApi.getDetail(id));
  } catch (error) {
    if (isNotFoundError(error)) {
      res.status(404).json({ message: "영화 정보를 찾을 수 없습니다." });
      return;
    }

    console.error(`[API] 영화 상세 조회 실패 (id: ${id}): ${describeError(error)}`);
    res.status(502).json({ message: "영화 정보를 불러오는데 실패했습니다." });
  }
});

export default router;
