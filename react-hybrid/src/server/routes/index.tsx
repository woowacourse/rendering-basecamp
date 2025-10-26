import { Router, Request, Response } from "express";

import { renderToString } from "react-dom/server";
import App from "../../client/App";
import React from "react";
import { moviesApi } from "../../client/api/movies";
import { SeoHead } from "../utils/SeoHead";
import generateHTML from "../utils/generateHTML";

const router = Router();

router.get("/", async (_: Request, res: Response) => {
  try {
    const movieList = await moviesApi.getPopular();
    console.log(movieList);

    const renderedApp = renderToString(
      <App initialMovies={{ movies: movieList.data.results }} />
    );

    const template = generateHTML();

    const renderedHTMLWithSeo = template.replace(
      "<!--{OG_TAGS}-->",
      SeoHead({
        title: "인기 영화 추천",
        description: "지금 인기 있는 영화들을 만나보세요.",
        image: `https://image.tmdb.org/t/p/w1280${movieList.data.results[0].backdrop_path}`,
        url: "https://rendering-basecamp-production-8f18.up.railway.app/",
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
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

export default router;
