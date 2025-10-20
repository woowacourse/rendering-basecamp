import { Router, Request, Response } from "express";

import { renderToString } from "react-dom/server";
import App from "../../client/App";
import React from "react";
import axios from "axios";

const router = Router();

function generateHTML() {
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
        <div id="root"><!--{BODY_AREA}--></div>
        <!--{INIT_DATA_AREA}-->
        <script src="/static/bundle.js"></script>
      </body>
    </html>
    `;
}

router.get("/", async (_: Request, res: Response) => {
  try {
    const template = generateHTML();

    const popularResponse = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?page=1&language=ko-KR`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const movies = popularResponse.data?.results ?? [];

    const renderedApp = renderToString(<App initialMovies={movies} />);

    const renderedHTMLWithInitialData = template.replace(
      "<!--{INIT_DATA_AREA}-->",
      /*html*/ `
      <script>
        window.__INITIAL_DATA__ = ${JSON.stringify({ movies })}
      </script>
    `
    );
    const renderedHTML = renderedHTMLWithInitialData.replace(
      "<!--{BODY_AREA}-->",
      renderedApp
    );

    res.send(renderedHTML);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/detail/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const template = generateHTML();

    const [popularResponse, detailResponse] = await Promise.all([
      axios.get(
        `https://api.themoviedb.org/3/movie/popular?page=1&language=ko-KR`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      ),
      axios.get(`https://api.themoviedb.org/3/movie/${id}?language=ko-KR`, {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }),
    ]);

    const movies = popularResponse.data?.results ?? [];
    const detail = detailResponse.data ?? null;

    const renderedApp = renderToString(
      <App initialMovies={movies} initialDetail={detail} />
    );

    const initialData = { movies, detail };
    const renderedHTMLWithInitialData = template.replace(
      "<!--{INIT_DATA_AREA}-->",
      /*html*/ `
      <script>
        window.__INITIAL_DATA__ = ${JSON.stringify(initialData)}
      </script>
    `
    );
    const renderedHTML = renderedHTMLWithInitialData.replace(
      "<!--{BODY_AREA}-->",
      renderedApp
    );

    res.send(renderedHTML);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
