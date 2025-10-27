import { Router, Request, Response } from "express";
import axios from "axios";

const router = Router();

const tmdbClient = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
  },
});

const generateHTML = (initialData: any) => `<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/static/styles/index.css" />
    <title>영화 리뷰</title>
  </head>
  <body>
    <div id="root"></div>
    <script>window.__INITIAL_DATA__ = ${JSON.stringify(initialData)};</script>
    <script src="/static/bundle.js"></script>
  </body>
</html>`;

router.get("/", async (req: Request, res: Response) => {
  try {
    const moviesResponse = await tmdbClient.get(
      "/movie/popular?page=1&language=ko-KR"
    );
    const movies = moviesResponse.data.results;

    const initialData = { movies };

    res.send(generateHTML(initialData));
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
    const movies = moviesResponse.data.results;
    const movieId = req.params.movieId;

    const detailResponse = await tmdbClient.get(
      `/movie/${movieId}?language=ko-KR`
    );
    const detail = detailResponse.data;

    const initialData = { movies, detail };

    res.send(generateHTML(initialData));
  } catch (error) {
    console.error("Error rendering page:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
