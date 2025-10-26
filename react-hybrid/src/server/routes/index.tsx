import { Router, Request, Response } from "express";

import { renderToString } from "react-dom/server";
import App from "../../client/App";
import React from "react";
import { moviesApi } from "../../client/api/movies";

const router = Router();

interface OgTagsParams {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  website: string;
}

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

function generateOgTags({
  title,
  description,
  url,
  imageUrl,
  website,
}: OgTagsParams) {
  return /*html*/ `
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:type" content="website" />
  `;
}

router.get("/", async (req: Request, res: Response) => {
  const template = generateHTML();
  const popularMoviesResponse = await moviesApi.getPopular();
  const movies = popularMoviesResponse.data.results;

  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const ogImage = movies?.[0]?.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movies[0].backdrop_path}`
    : `${baseUrl}/images/logo.png`;

  const renderedApp = renderToString(<App initialMovies={movies} />);

  const renderedHTMLWithOgTags = template.replace(
    "<!--{OG_TAGS}-->",
    generateOgTags({
      title: "영화 리뷰 - 인기 영화",
      description: "가장 인기 있는 영화들을 만나보세요.",
      url: `${baseUrl}/`,
      imageUrl: `${ogImage}`,
      website: "영화 리뷰",
    })
  );

  const renderedHTMLWithInitialData = renderedHTMLWithOgTags.replace(
    "<!--{INIT_DATA_AREA}-->",
    /*html*/ `
    <script>
      window.__INITIAL_DATA__ = ${JSON.stringify(movies)}
      
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
  const { id } = req.params;
  const template = generateHTML();

  const [popularMoviesResponse, detailMovieResponse] = await Promise.all([
    moviesApi.getPopular(),
    moviesApi.getDetail(Number(id)),
  ]);

  const movies = popularMoviesResponse.data.results;
  const detailMovie = detailMovieResponse.data;

  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const ogImage = `https://image.tmdb.org/t/p/w1280${detailMovie.poster_path}`;

  const renderedApp = renderToString(<App initialMovies={movies} />);

  const renderedHTMLWithOgTags = template.replace(
    "<!--{OG_TAGS}-->",
    generateOgTags({
      title: `영화 리뷰 - ${detailMovie.title}`,
      description: `${detailMovie.overview}`,
      url: `${baseUrl}/`,
      imageUrl: `${ogImage}`,
      website: "영화 리뷰",
    })
  );

  const renderedHTMLWithInitialData = renderedHTMLWithOgTags.replace(
    "<!--{INIT_DATA_AREA}-->",
    /*html*/ `
    <script>
      window.__INITIAL_DATA__ = ${JSON.stringify({ movies, detailMovie })}
      
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
