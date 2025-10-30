import { Router, Request, Response } from "express";
import { renderToString } from "react-dom/server";
import React from "react";
import App from "../../client/App";
import axios from "axios";
import MovieHomePage from "../../client/pages/MovieHomePage";
import MovieDetailPage from "../../client/pages/MovieDetailPage";
import { MovieItem } from "../../client/types/Movie.types";

const router = Router();

const tmdbClient = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
  },
});

function generateHTML(ogTags: string = "") {
  return /*html*/ `
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
        <div id="root"><!--{BODY_AREA}--></div>
        <!--{INIT_DATA_AREA}-->
        <script src="/static/bundle.js"></script>
      </body>
    </html>
    `;
}

function generateHomeOGTags() {
  return /*html*/ `
    <meta property="og:type" content="website"/>
    <meta property="og:site_name" content="영화 리뷰"/>
    <meta property="og:title" content="인기 영화 목록"/>
    <meta property="og:description" content="지금 인기 있는 영화를 확인하세요"/>
    <meta property="og:locale" content="ko_KR"/>
  `;
}

function generateMovieOGTags(movie: MovieItem) {
  const title = movie.title || "영화 상세";
  const description = movie.overview || "영화 정보를 확인하세요";
  const image = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "";

  return /*html*/ `
    <meta property="og:type" content="video.movie"/>
    <meta property="og:site_name" content="영화 리뷰"/>
    <meta property="og:title" content="${title}"/>
    <meta property="og:description" content="${description}"/>
    ${image ? `<meta property="og:image" content="${image}"/>` : ""}
    <meta property="og:locale" content="ko_KR"/>
  `;
}

router.get("/", async (req: Request, res: Response) => {
  const ogTags = generateHomeOGTags();
  const template = generateHTML(ogTags);

  const movieData = await tmdbClient.get("/movie/popular?page=1&language=ko-KR");
  const movies = movieData.data.results;
  const renderedApp = renderToString(<App Component={MovieHomePage} pageProps={{movies}}/>);

  const renderedHTMLWithInitialData = template.replace(
    "<!--{INIT_DATA_AREA}-->",
    /*html*/ `
    <script>
      window.__INITIAL_DATA__ = {
        movies: ${JSON.stringify(movies)}
      }
    </script>
  `
  );

  const renderedHTML = renderedHTMLWithInitialData.replace(
    "<!--{BODY_AREA}-->",
    renderedApp
  );

  res.send(renderedHTML);
});

router.get("/detail/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const [movieListData, movieDetailData] = await Promise.all([
    tmdbClient.get("/movie/popular?page=1&language=ko-KR"),
    tmdbClient.get(`/movie/${id}?language=ko-KR`)
  ]);
  const movies = movieListData.data.results;
  const movieDetail = movieDetailData.data;

  const ogTags = generateMovieOGTags(movieDetail);
  const template = generateHTML(ogTags);

  const renderedApp = renderToString(<App Component={MovieDetailPage} pageProps={{movies, movieId: Number(id), movieDetail}}/>);

  const renderedHTMLWithInitialData = template.replace(
    "<!--{INIT_DATA_AREA}-->",
    /*html*/ `
    <script>
      window.__INITIAL_DATA__ = {
        movies: ${JSON.stringify(movies)},
        movieDetail: ${JSON.stringify(movieDetail)}
      }
    </script>
  `
  );

  const renderedHTML = renderedHTMLWithInitialData.replace(
    "<!--{BODY_AREA}-->",
    renderedApp
  );

  res.send(renderedHTML);
});

export default router;
