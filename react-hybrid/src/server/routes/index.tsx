import { Router, Request, Response } from "express";

import { renderToString } from "react-dom/server";
import App from "../../client/App";
import React from "react";
import { moviesApi } from "../../client/api/movies";
import MovieHomePage from "../../client/pages/MovieHomePage";
import MovieDetailPage from "../../client/pages/MovieDetailPage";
import { fetchApi } from "../util/api";
import { injectDataToTemplate } from "../util/generateHTML";

const router = Router();

router.get("/", async (_: Request, res: Response) => {
  const popularMoviesResult = await fetchApi(moviesApi.getPopular());

  if (popularMoviesResult.status === "error") {
    return res.status(500).send("영화 목록을 불러오는데 실패했습니다.");
  }

  const renderedApp = renderToString(
    <App
      Component={MovieHomePage}
      props={{ popularMoviesResult: popularMoviesResult.data.results }}
    />
  );

  const hydrationData = {
    Component: "MovieHomePage",
    props: { popularMoviesResult: popularMoviesResult.data.results },
  };

  const renderedHTML = injectDataToTemplate(renderedApp, hydrationData);

  res.send(renderedHTML);
});

router.get("/detail/:id", async (req: Request, res: Response) => {
  const [popularMoviesResult, movieDetailResult] = await Promise.all([
    fetchApi(moviesApi.getPopular()),
    fetchApi(moviesApi.getDetail(Number(req.params.id))),
  ]);

  if (movieDetailResult.status === "error") {
    return res.status(404).send("영화를 찾을 수 없습니다.");
  }

  if (popularMoviesResult.status === "error") {
    return res.status(500).send("영화 목록을 불러오는데 실패했습니다.");
  }

  const renderedApp = renderToString(
    <App
      Component={MovieDetailPage}
      props={{
        popularMoviesResult: popularMoviesResult.data.results,
        movieDetailResult: movieDetailResult.data,
      }}
    />
  );

  const hydrationData = {
    Component: "MovieDetailPage",
    props: {
      popularMoviesResult: popularMoviesResult.data.results,
      movieDetailResult: movieDetailResult.data,
    },
  };

  const renderedHTML = injectDataToTemplate(
    renderedApp,
    hydrationData,
    movieDetailResult.data
  );

  res.send(renderedHTML);
});

export default router;
