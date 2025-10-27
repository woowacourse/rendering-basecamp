import { Router, Request, Response } from "express";
import { renderToString } from "react-dom/server";
import { moviesApi } from "../../client/api/movies";
import React from "react";
import App from "../../client/App";

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

router.get("/:movieId", async (req: Request, res: Response) => {
  const { movieId } = req.params;

  const moviesData = await moviesApi.getPopular();
  const detailData = await moviesApi.getDetail(Number(movieId));

  const movies = moviesData.data.results;
  const movieDetail = detailData.data;

  const ogTitle = `${movieDetail.title} - 영화 리뷰`;
  const ogDescription =
    movieDetail.overview || `${movieDetail.title} 영화 정보를 확인하세요`;
  const ogImage = movieDetail.poster_path
    ? `https://image.tmdb.org/t/p/original${movieDetail.poster_path}`
    : `${req.protocol}://${req.get("host")}/images/no_image.png`;
  const ogUrl = `${req.protocol}://${req.get("host")}/detail/${movieId}`;

  const ogTags = /*html*/ `
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="영화 리뷰" />
    <meta property="og:title" content="${ogTitle}" />
    <meta property="og:description" content="${ogDescription}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:url" content="${ogUrl}" />
    
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${ogTitle}" />
    <meta name="twitter:description" content="${ogDescription}" />
    <meta name="twitter:image" content="${ogImage}" />
  `;

  const template = generateHTML();

  const renderedApp = renderToString(
    <App
      movies={movies}
      movieDetail={movieDetail}
      movieId={Number(movieId)}
      initialPath={`/detail/${movieId}`}
    />
  );

  const renderedHTMLWithInitialData = template.replace(
    "<!--{INIT_DATA_AREA}-->",
    /*html*/ `
    <script>
      window.__INITIAL_DATA__ = {
        movies: ${JSON.stringify(movies)},
        detail: ${JSON.stringify(movieDetail)}
      }
    </script>
  `
  );

  const renderedHTML = renderedHTMLWithInitialData
    .replace("<!--{OG_TAGS}-->", ogTags)
    .replace("<!--{BODY_AREA}-->", renderedApp)
    .replace(
      /<title>영화 리뷰<\/title>/,
      `<title>${movieDetail.title} - 영화 리뷰</title>`
    );

  res.send(renderedHTML);
});

export default router;
