import { Router, Request, Response } from "express";

import { renderToString } from "react-dom/server";
import App from "../../client/App";
import React from "react";
import { moviesApi } from "../../client/api/movies";
import { MovieItem } from "../../client/types/Movie.types";
import { MovieDetailResponse } from "../../client/types/MovieDetail.types";

const router = Router();

function generateHTML(
  appHTML: string,
  routeType: "home" | "detail",
  initialData: {
    movies: MovieItem[];
    movieItem?: MovieDetailResponse;
  }
) {
  return /*html*/ `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/static/styles/index.css" />
        <title>영화 리뷰</title>
        <!--{OG_TAGS}-->
      </head>
      <body>
        <div id="root">${appHTML}</div>
        <script>
          window.__INITIAL_DATA__ = ${JSON.stringify({
            routeType,
            initialData,
          })}
        </script>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
    `;
}

router.get("/", async (_: Request, res: Response) => {
  const { data } = await moviesApi.getPopular();
  const movies = data.results.slice(0, 12);
  const initialData = { movies };
  console.log("SSR movies count:", movies.length);

  const renderedApp = renderToString(
    <App routeType='home' initialData={initialData} />
  );

  const html = generateHTML(renderedApp, "home", initialData);

  res.send(html);
});

router.get("/detail/:movieId", async (req: Request, res: Response) => {
  const id = Number(req.params.movieId);

  const [popularRes, detailRes] = await Promise.all([
    moviesApi.getPopular(),
    moviesApi.getDetail(id),
  ]);

  const initialData = {
    movies: popularRes.data.results.slice(0, 12),
    detail: detailRes.data,
  };

  const html = renderToString(
    <App routeType='detail' initialData={initialData} />
  );

  res.send(generateHTML(html, "detail", initialData));
});

export default router;
