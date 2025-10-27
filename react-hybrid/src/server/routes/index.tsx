import { Router, Request, Response } from "express";
import axios from "axios";
import { renderToString } from "react-dom/server";
import React from "react";
import { StaticRouter } from "react-router-dom";
import App from "../../client/App";
import { MovieItem } from "../../client/types/Movie.types";
import { MovieDetailResponse } from "../../client/types/MovieDetail.types";

const router = Router();

const tmdbClient = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
  },
});

const generateHTML = (
  html: string,
  initialData: any,
  ogTags?: string
) => `<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${ogTags || ""}
    <link rel="stylesheet" href="/static/styles/index.css" />
    <title>영화 리뷰</title>
  </head>
  <body>
    <div id="root">${html}</div>
    <script>window.__INITIAL_DATA__ = ${JSON.stringify(initialData)};</script>
    <script src="/static/bundle.js"></script>
  </body>
</html>`;

router.get("/", async (req: Request, res: Response) => {
  try {
    const moviesResponse = await tmdbClient.get(
      "/movie/popular?page=1&language=ko-KR"
    );
    const movies: MovieItem[] = moviesResponse.data.results;

    const initialData = { movies };

    const html = renderToString(
      <StaticRouter location={req.url}>
        <App initialMovies={movies} initialDetail={undefined} />
      </StaticRouter>
    );

    res.send(generateHTML(html, initialData));
  } catch (error) {
    console.error("Error rendering page:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/detail/:movieId", async (req: Request, res: Response) => {
  try {
    const moviesResponse = await tmdbClient.get(
      "/movie/popular?page=1&language=ko-KR"
    );
    const movies: MovieItem[] = moviesResponse.data.results;
    const movieId = req.params.movieId;

    const detailResponse = await tmdbClient.get(
      `/movie/${movieId}?language=ko-KR`
    );
    const detail: MovieDetailResponse = detailResponse.data;

    const initialData = { movies, detail };

    const ogTags = `
    <meta property="og:title" content="${detail.title}" />
    <meta property="og:description" content="${detail.overview}" />
    <meta property="og:image" content="https://image.tmdb.org/t/p/w500${detail.poster_path}" />
    <meta property="og:type" content="website" />
    `;

    const html = renderToString(
      <StaticRouter location={req.url}>
        <App initialMovies={movies} initialDetail={detail} />
      </StaticRouter>
    );

    res.send(generateHTML(html, initialData, ogTags));
  } catch (error) {
    console.error("Error rendering page:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
