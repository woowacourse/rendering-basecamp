import { Router, Request, Response } from "express";

import { renderToString } from "react-dom/server";
import App from "../../client/App";
import React from "react";
import { moviesApi } from "../api/movies";
import { HTMLBuilder } from "../utils/HTMLBuilder";

const router = Router();

router.get("/", async (_: Request, res: Response) => {
  const { results: movies } = await moviesApi
    .getPopular()
    .then((res) => res.data);

  const body = renderToString(<App path="/" movies={movies} />);

  const template = HTMLBuilder()
    .generateBody(body)
    .generateMetaTags(movies[0])
    .initData({
      path: "/",
      movies,
    })
    .getHTML();

  res.send(template);
});

router.get("/detail/:id", async (req: Request, res: Response) => {
  const { results: movies } = await moviesApi
    .getPopular()
    .then((res) => res.data);

  const movieDetail = await moviesApi
    .getDetail(Number(req.params.id))
    .then((res) => res.data);

  const body = renderToString(
    <App
      path={`/movies/${req.params.id}`}
      movies={movies}
      movieDetail={movieDetail}
    />
  );

  const template = HTMLBuilder()
    .generateBody(body)
    .generateMetaTags(movieDetail)
    .initData({
      path: `/movies/${req.params.id}`,
      movies,
      movieDetail,
    })
    .getHTML();

  res.send(template);
});

export default router;
