import { Router, Request, Response } from "express";

import { renderToString } from "react-dom/server";
import App from "../../client/App";
import React from "react";
import { moviesApi } from "../../client/api/movies";
import type { InitialData } from "../../client/types/global";

const router = Router();

const DEFAULT_TITLE = "영화 리뷰";

function escapeHTML(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function serializeData(data: InitialData) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function generateHTML(initialData: InitialData) {
  const { movieDetail } = initialData;
  const title = movieDetail ? `${movieDetail.title} | ${DEFAULT_TITLE}` : DEFAULT_TITLE;
  const renderedApp = renderToString(<App {...initialData} />);

  return /*html*/ `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/static/styles/index.css" />
        <title>${escapeHTML(title)}</title>
      </head>
      <body>
        <div id="root">${renderedApp}</div>
        <script>
          window.__INITIAL_DATA__ = ${serializeData(initialData)}
        </script>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
    `;
}

async function fetchPopularMovies() {
  try {
    const response = await moviesApi.getPopular();
    return response.data.results;
  } catch {
    return [];
  }
}

router.get("/", async (_: Request, res: Response) => {
  const movies = await fetchPopularMovies();

  res.send(generateHTML({ movies }));
});

router.get("/detail/:id", async (req: Request, res: Response) => {
  const [movies, movieDetail] = await Promise.all([
    fetchPopularMovies(),
    moviesApi
      .getDetail(Number(req.params.id))
      .then((response) => response.data)
      .catch(() => null),
  ]);

  res.send(generateHTML({ movies, movieDetail }));
});

export default router;
