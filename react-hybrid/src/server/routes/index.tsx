import { Router, Request, Response } from "express";

import { renderToString } from "react-dom/server";
import App from "../../client/App";
import React from "react";
import { moviesApi } from "../../client/api/movies";

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
    const response = await moviesApi.getPopular();
    const movies = response.data.results;
    const initialData = { movies };

    const template = generateHTML();
    const renderedApp = renderToString(<App initialData={initialData} />);

    const renderedHTMLWithInitialData = template.replace(
      "<!--{INIT_DATA_AREA}-->",
      /*html*/ `
      <script>
        window.__INITIAL_DATA__ = ${JSON.stringify(initialData)};
      </script>
    `
    );
    const renderedHTML = renderedHTMLWithInitialData
      .replace("<!--{BODY_AREA}-->", renderedApp)
      .replace("<!--{OG_TAGS}-->", "");

    res.send(renderedHTML);
  } catch (error) {
    console.error("Failed to render home page:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/detail/:id", async (req: Request, res: Response) => {
  try {
    const movieId = Number(req.params.id);

    const [popularResponse, detailResponse] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(movieId),
    ]);

    const movies = popularResponse.data.results;
    const movieDetail = detailResponse.data;


    const imageUrl = movieDetail.poster_path
      ? `https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`
      : "/images/no_image.png";
    const ogTags = /*html*/ `
      <title>${movieDetail.title} - 영화 리뷰</title>
      <meta name="description" content="${movieDetail.overview || `${movieDetail.title} 상세 정보`}" />
      <meta property="og:title" content="${movieDetail.title}" />
      <meta property="og:description" content="${movieDetail.overview || `${movieDetail.title} 상세 정보`}" />
      <meta property="og:image" content="${imageUrl}" />
    `;  

    const initialData = { movies, movieDetail };
    const template = generateHTML();
    const renderedApp = renderToString(<App initialData={initialData} />);

    const renderedHTMLWithInitialData = template.replace(
      "<!--{INIT_DATA_AREA}-->",
      /*html*/ `
      <script>
        window.__INITIAL_DATA__ = ${JSON.stringify(initialData)};
      </script>
    `
    );

    const renderedHTML = renderedHTMLWithInitialData
      .replace("<!--{BODY_AREA}-->", renderedApp)
      .replace("<!--{OG_TAGS}-->", ogTags);
      
    res.send(renderedHTML);

  } catch (error) {
    console.error("Failed to render detail page:", error);
    res.status(500).send("Internal Server Error");
  }
});


export default router;
