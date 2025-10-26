import { Router, Request, Response } from "express";
import React from "react";
import { renderToString } from "react-dom/server";
import App from "../../client/App";

async function fetchPopularMovies() {
  const TMDB_BASE = "https://api.themoviedb.org/3";
  const resp = await fetch(`${TMDB_BASE}/movie/popular?language=ko-KR&page=1`, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN ?? ""}`,
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  if (!resp.ok) {
    throw new Error("인기 영화 목록을 불러오는 데 실패했습니다.");
  }

  const json = (await resp.json()) as { results: any[] };
  return json.results;
}

async function fetchMovieDetail(movieId: string) {
  const TMDB_BASE = "https://api.themoviedb.org/3";
  const resp = await fetch(`${TMDB_BASE}/movie/${movieId}?language=ko-KR`, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN ?? ""}`,
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  if (!resp.ok) {
    throw new Error("영화 상세 정보를 불러오는 데 실패했습니다.");
  }

  const json = (await resp.json()) as any;
  return json;
}

function generateHTML() {
  return /*html*/ `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <link rel="stylesheet" href="/static/styles/index.css" />
        <title>영화 리뷰</title>
        <!--{OG_TAGS}-->
      </head>
      <body>
        <div id="root"><!--{BODY_AREA}--></div>
        <!--{INIT_DATA_AREA}-->
        <script src="/static/bundle.js"></script>
      </body>
    </html>
  `;
}

function renderFullPage(initialData: any, ogTags?: string) {
  const renderedApp = renderToString(<App initialData={initialData} />);

  let html = generateHTML();

  html = html.replace("<!--{OG_TAGS}-->", ogTags ?? "");

  html = html.replace(
    "<!--{INIT_DATA_AREA}-->",
    /*html*/ `
      <script>
        window.__INITIAL_DATA__ = ${JSON.stringify(initialData)};
      </script>
    `
  );

  html = html.replace("<!--{BODY_AREA}-->", renderedApp);

  return html;
}

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const movies = await fetchPopularMovies();

    const ogTags = [
      `<meta property="og:title" content="요즘 인기 있는 영화 🎬" />`,
      `<meta property="og:description" content="현재 인기 급상승 중인 영화 목록을 확인해보세요." />`,
      `<meta property="og:image" content="https://image.tmdb.org/t/p/w500${
        movies?.[0]?.poster_path ?? ""
      }" />`,
    ].join("\n");

    const initialData = { movies };

    const html = renderFullPage(initialData, ogTags);
    res.send(html);
  } catch (err) {
    console.error(err);

    const fallbackData = { movies: [] };
    const html = renderFullPage(fallbackData, "");
    res.status(500).send(html);
  }
});

router.get("/detail/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const [movies, movieDetail] = await Promise.all([
      fetchPopularMovies().catch(() => []),
      fetchMovieDetail(id),
    ]);

    const ogTags = [
      `<meta property="og:title" content="${movieDetail.title}" />`,
      `<meta property="og:description" content="${movieDetail.overview}" />`,
      movieDetail.poster_path
        ? `<meta property="og:image" content="https://image.tmdb.org/t/p/w500${movieDetail.poster_path}" />`
        : "",
    ].join("\n");

    const initialData = {
      movies,
      movieDetail,
    };

    const html = renderFullPage(initialData, ogTags);
    res.send(html);
  } catch (err) {
    console.error(err);

    const fallbackData = {
      movies: [],
      movieDetail: null,
    };

    const html = renderFullPage(fallbackData, "");
    res.status(500).send(html);
  }
});

export default router;
