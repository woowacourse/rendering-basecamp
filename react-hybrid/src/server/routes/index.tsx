import { Router, Request, Response } from "express";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "../../client/App";
import { moviesApi } from "../../client/api/movies";

const router = Router();

const generateHTML = (
  renderedApp: string,
  initialData: {
    movies: unknown[];
    movie?: unknown;
  },
) => {
  const serializedData = JSON.stringify(initialData).replace(/</g, "\\u003c");

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
          window.__INITIAL_DATA__ = ${serializedData};
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

    const renderedApp = renderToString(
      <StaticRouter location="/">
        <App movies={movies} />
      </StaticRouter>,
    );

    const html = generateHTML(renderedApp, {
      movies,
    });

    res.type("html").send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send("영화 정보를 불러오지 못했습니다.");
  }
});

router.get("/detail/:movieId", async (req: Request, res: Response) => {
  const movieId = Number(req.params.movieId);

  if (!Number.isSafeInteger(movieId) || movieId <= 0) {
    res.status(404).send("페이지를 찾을 수 없습니다.");
    return;
  }

  try {
    const [{ data: popularMovies }, { data: movie }] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(movieId),
    ]);

    const movies = popularMovies.results;

    const renderedApp = renderToString(
      <StaticRouter location={req.originalUrl}>
        <App movies={movies} movie={movie} />
      </StaticRouter>,
    );

    const html = generateHTML(renderedApp, {
      movies,
      movie,
    });

    res.type("html").send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send("영화 정보를 불러오지 못했습니다.");
  }
});

export default router;
