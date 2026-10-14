import { Router, Request, Response } from "express";
import { renderToString } from "react-dom/server";

import App from "../../client/App";
import { moviesApi } from "../../client/api/movies";

const router = Router();

const generateHTML = (renderedApp: string, movies: unknown[]) => {
  const serializedMovies = JSON.stringify({ movies }).replace(/</g, "\\u003c");

  return `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/static/styles/index.css" />
        <title>영화 리뷰</title>
      </head>
      <body>
        <div id="root">${renderedApp}</div>

        <script>
          window.__INITIAL_DATA__ = ${serializedMovies};
        </script>

        <script src="/static/bundle.js"></script>
      </body>
    </html>
  `;
};

router.get("/", async (_req: Request, res: Response) => {
  try {
    const { data } = await moviesApi.getPopular();
    const movies = data.results;

    const renderedApp = renderToString(<App movies={movies} />);

    const html = generateHTML(renderedApp, movies);

    res.type("html").send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send("영화 정보를 불러오지 못했습니다.");
  }
});

export default router;
