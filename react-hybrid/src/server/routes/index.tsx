import { Router, Request, Response } from "express";

import { renderToString } from "react-dom/server";
import App from "../../client/App";
import React from "react";
import { moviesApi } from "../../client/api/movies";
import generateHTML from "../utils/generateHTML";
import generateMetaTag from "../utils/generateMetaTag";
import extractURL from "../utils/extractURL";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const { data } = await moviesApi.getPopular();
  const movies = data.results.slice(0, 12);
  const initialData = { movies };

  const renderedApp = renderToString(
    <App routeType='home' initialData={initialData} />
  );

  const metaTags = generateMetaTag({
    title: "영화리뷰",
    description: "여긴 영화 메인페이지입니다.",
    image: `https://image.tmdb.org/t/p/original${movies[0].backdrop_path}`,
    url: extractURL(req),
  });

  const html = generateHTML({
    appHTML: renderedApp,
    routeType: "home",
    initialData,
    title: "영화리뷰",
    metaTags,
  });

  res.send(html);
});

router.get("/detail/:movieId", async (req: Request, res: Response) => {
  const id = Number(req.params.movieId);

  const [popularRes, detailRes] = await Promise.all([
    moviesApi.getPopular(),
    moviesApi.getDetail(id),
  ]);

  const initialData = {
    movies: popularRes.data.results.slice(0, 12),
    detail: detailRes.data,
  };

  const renderedApp = renderToString(
    <App routeType='detail' initialData={initialData} />
  );

  const metaTags = generateMetaTag({
    title: detailRes.data.original_title,
    description: detailRes.data.overview,
    image: `https://image.tmdb.org/t/p/original${detailRes.data.backdrop_path}`,
    url: extractURL(req),
  });

  const html = generateHTML({
    appHTML: renderedApp,
    routeType: "detail",
    initialData,
    title: detailRes.data.original_title,
    metaTags,
  });

  res.send(html);
});

export default router;
