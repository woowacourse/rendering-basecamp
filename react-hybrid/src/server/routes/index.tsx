import { Router, Request, Response } from "express";

import { renderToString } from "react-dom/server";
import App from "../../client/App";
import React from "react";
import { moviesApi } from "../../client/api/movies";
import MovieHomePage from "../../client/pages/MovieHomePage";
import MovieDetailPage from "../../client/pages/MovieDetailPage";
import { fetchApi } from "../util/api";

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
  const template = generateHTML();
  const popularMoviesResult = await fetchApi(moviesApi.getPopular(1));

  const renderedApp = renderToString(
    <App Component={MovieHomePage} props={{ popularMoviesResult }} />
  );

  const initialData = {
    Component: "MovieHomePage",
    props: { popularMoviesResult },
  };

  const renderedHTMLWithInitialData = template.replace(
    "<!--{INIT_DATA_AREA}-->",
    /*html*/ `
    <script>
      window.__INITIAL_DATA__ = ${JSON.stringify(initialData)}
    </script>
  `
  );

  const renderedHTMLWithInitialDataAndBody =
    renderedHTMLWithInitialData.replace("<!--{BODY_AREA}-->", renderedApp);

  const renderedHTML = renderedHTMLWithInitialDataAndBody.replace(
    "<!--{OG_TAGS}-->",
    /*html*/ `
    <meta property="og:title" content="마빈의 영화 리뷰" />
    <meta property="og:description" content="마빈의 영화 리뷰1 !!!!" />
    <meta property="og:image" content="/images/logo.png" />
  `
  );

  res.send(renderedHTML);
});

router.get("/detail/:id", async (req: Request, res: Response) => {
  const template = generateHTML();
  const [popularMoviesResult, movieDetailResult] = await Promise.all([
    fetchApi(moviesApi.getPopular()),
    fetchApi(moviesApi.getDetail(Number(req.params.id))),
  ]);

  const renderedApp = renderToString(
    <App
      Component={MovieDetailPage}
      props={{
        popularMoviesResult,
        movieDetailResult,
      }}
    />
  );

  const initialData = {
    Component: "MovieDetailPage",
    props: {
      popularMoviesResult,
      movieDetailResult,
    },
  };

  const renderedHTMLWithInitialData = template.replace(
    "<!--{INIT_DATA_AREA}-->",
    /*html*/ `
    <script>
      window.__INITIAL_DATA__ = ${JSON.stringify(initialData)}
    </script>
  `
  );
  const renderedHTMLWithInitialDataAndBody =
    renderedHTMLWithInitialData.replace("<!--{BODY_AREA}-->", renderedApp);

  const renderedHTML = renderedHTMLWithInitialDataAndBody.replace(
    "<!--{OG_TAGS}-->",
    /*html*/ `
    <meta property="og:title" content="${movieDetailResult.data.title}" />
    <meta property="og:description" content="${movieDetailResult.data.overview}" />
    <meta property="og:image" content="${movieDetailResult.data.poster_path}" />
  `
  );
  res.send(renderedHTML);
});

export default router;
