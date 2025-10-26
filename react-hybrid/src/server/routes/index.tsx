import { Router, Request, Response } from "express";
import { renderToString } from "react-dom/server";
import React from "react";
import App from "../../client/App";
import axios from "axios";

const router = Router();

const TMDB_API_KEY = process.env.TMDB_ACCESS_TOKEN;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

function generateHTML(bodyContent: string, initialData: any, ogTags: string = "") {
  return `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/static/styles/index.css" />
        <title>영화 리뷰</title>
        ${ogTags}
      </head>
      <body>
        <div id="root">${bodyContent}</div>
        <script>
          window.__INITIAL_DATA__ = ${JSON.stringify(initialData)};
        </script>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
  `;
}

router.get("/", async (_: Request, res: Response) => {
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/movie/popular?page=1&language=ko-KR`,
      {
        headers: {
          Authorization: `Bearer ${TMDB_API_KEY}`,
        },
      }
    );

    const movies = response.data.results;

    const renderedApp = renderToString(<App url="/" />);

    const initialData = {
      movies,
      url: "/",
    };

    const html = generateHTML(renderedApp, initialData);
    res.send(html);
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/detail/:movieId", async (req: Request, res: Response) => {
  try {
    const { movieId } = req.params;

    const [moviesResponse, detailResponse] = await Promise.all([
      axios.get(`${TMDB_BASE_URL}/movie/popular?page=1&language=ko-KR`, {
        headers: {
          Authorization: `Bearer ${TMDB_API_KEY}`,
        },
      }),
      axios.get(`${TMDB_BASE_URL}/movie/${movieId}?language=ko-KR`, {
        headers: {
          Authorization: `Bearer ${TMDB_API_KEY}`,
        },
      }),
    ]);

    const movies = moviesResponse.data.results;
    const movieDetail = detailResponse.data;

    const renderedApp = renderToString(<App url={`/detail/${movieId}`} />);

    const initialData = {
      movies,
      movieDetail,
      url: `/detail/${movieId}`,
    };

    const ogTags = `
      <meta property="og:title" content="${movieDetail.title}" />
      <meta property="og:description" content="${movieDetail.overview}" />
      <meta property="og:image" content="https://image.tmdb.org/t/p/w500${movieDetail.poster_path}" />
    `;

    const html = generateHTML(renderedApp, initialData, ogTags);
    res.send(html);
  } catch (error) {
    console.error("Error fetching movie detail:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
