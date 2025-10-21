import { Router, Request, Response } from "express";

import { renderToString } from "react-dom/server";
import App from "../../client/App";
import React from "react";
import { moviesApi } from "../../client/api/movies";
import { SeoHead } from "../utils/SeoHead";
import generateHTML from "../utils/generateHTML";

const router = Router();

router.get("/detail/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const template = generateHTML();

  const [movieList, movieDetail] = await Promise.all([
    moviesApi.getPopular(),
    moviesApi.getDetail(Number(id)),
  ]);

  const renderedApp = renderToString(
    <App initialMovies={movieList.data.results} />
  );

  const renderedHTMLWithSeo = template.replace(
    "<!--{OG_TAGS}-->",
    SeoHead({
      title: movieDetail.data.title,
      description: movieDetail.data.overview,
      image: `https://image.tmdb.org/t/p/w1280${movieDetail.data.backdrop_path}`,
      url: `https://rendering-basecamp-production-8f18.up.railway.app/detail/${movieDetail.data.id}`,
    })
  );

  const renderedHTMLWithInitialData = renderedHTMLWithSeo.replace(
    "<!--{INIT_DATA_AREA}-->",
    `
    <script>
      window.__INITIAL_DATA__ = {
        movies: ${JSON.stringify(movieList.data.results)}
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
