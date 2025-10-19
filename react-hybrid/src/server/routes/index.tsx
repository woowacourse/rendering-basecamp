import { Router, Request, Response } from "express";

import { renderToString } from "react-dom/server";
import App from "../../client/App";
import React from "react";
import { moviesApi } from "../../client/api/movies";
import MovieHomePage from "../../client/pages/MovieHomePage";
import MovieDetailPage from "../../client/pages/MovieDetailPage";
import { fetchApi } from "../util/api";
import { generateHTML, generateMeta } from "../util/generateHTML";

const router = Router();

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
    ${generateMeta()}
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
    ${generateMeta(movieDetailResult.data)}
  `
  );
  res.send(renderedHTML);
});

export default router;
