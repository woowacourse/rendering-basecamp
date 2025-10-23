import { Router, Request, Response } from "express";

import { renderToString } from "react-dom/server";
import App from "../../client/App";
import React from "react";
import { generateHTML } from '../utils/generateHTML';
import { moviesApi } from '../../client/api/movies';
import { buildOgTags } from '../utils/seoMeta';



const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const template = generateHTML();

    const popularResponse = await moviesApi.getPopular();
    const movies = popularResponse.data?.results ?? [];

    const renderedApp = renderToString(<App initialMovies={movies} />);

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const ogImage = movies?.[0]?.backdrop_path
      ? `https://image.tmdb.org/t/p/w1280${movies[0].backdrop_path}`
      : `${baseUrl}/images/logo.png`;
    const ogTags = buildOgTags({
      url: `${baseUrl}/`,
      title: "영화 리뷰 - 인기 영화 모아보기",
      description: "지금 인기 있는 영화를 확인해보세요.",
      image: ogImage,
      type: "website",
    });

    const renderedHTMLWithInitialData = template.replace(
      "<!--{INIT_DATA_AREA}-->",
      /*html*/ `
      <script>
        window.__INITIAL_DATA__ = ${JSON.stringify({ movies })}
      </script>
    `
    );
    const renderedHTMLWithOg = renderedHTMLWithInitialData.replace(
      "<!--{OG_TAGS}-->",
      ogTags
    );
    const pageTitle = "영화 리뷰 - 인기 영화 모아보기";
    const renderedHTMLWithTitle = renderedHTMLWithOg.replace(
      "<!--{TITLE}-->",
      pageTitle
    );
    const renderedHTML = renderedHTMLWithTitle.replace(
      "<!--{BODY_AREA}-->",
      renderedApp
    );

    res.send(renderedHTML);
  } catch (error) {
    console.error('Error in / route:', error);
    if (error instanceof Error) {
      console.error('Stack:', error.stack);
    }
    res.status(500).send("Internal Server Error: " + (error instanceof Error ? error.message : String(error)));
  }
});

router.get("/detail/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const template = generateHTML();

    const [popularResponse, detailResponse] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(Number(id)),
    ]);

    const movies = popularResponse.data?.results ?? [];
    const detail = detailResponse.data ?? null;

    const renderedApp = renderToString(<App initialMovies={movies} />);

    const initialData = { movies, detail };

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const imagePath = detail?.backdrop_path || detail?.poster_path || "";
    const ogImage = imagePath
      ? `https://image.tmdb.org/t/p/w1280${imagePath}`
      : `${baseUrl}/images/logo.png`;
    const ogTags = buildOgTags({
      url: `${baseUrl}/detail/${id}`,
      title: `${detail?.title ?? "영화 상세"} - 영화 리뷰`,
      description: detail?.overview
        ? detail.overview.slice(0, 140)
        : "영화 상세 정보를 확인해보세요.",
      image: ogImage,
      type: "video.movie",
    });

    const renderedHTMLWithInitialData = template.replace(
      "<!--{INIT_DATA_AREA}-->",
      /*html*/ `
      <script>
        window.__INITIAL_DATA__ = ${JSON.stringify(initialData)}
      </script>
    `
    );
    const renderedHTMLWithOg = renderedHTMLWithInitialData.replace(
      "<!--{OG_TAGS}-->",
      ogTags
    );
    const pageTitle = `${detail?.title ?? "영화 상세"} - 영화 리뷰`;
    const renderedHTMLWithTitle = renderedHTMLWithOg.replace(
      "<!--{TITLE}-->",
      pageTitle
    );
    const renderedHTML = renderedHTMLWithTitle.replace(
      "<!--{BODY_AREA}-->",
      renderedApp
    );

    res.send(renderedHTML);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
