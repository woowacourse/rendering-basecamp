import { Router, type Request, type Response } from "express";

import { renderToString } from "react-dom/server";
import App from "../../client/App";
import { moviesApi } from "../../client/api/movies";
import { generateOGTags } from "../utils/generateOGTags";

const router = Router();

function generateHTML() {
  return /*html*/ `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/static/styles/index.css" />
        <title>세오의 영화 리뷰</title>
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

router.get("/", async (req: Request, res: Response) => {
  try {
    const template = generateHTML();

    const popularMoviesResponse = await moviesApi.getPopular();
    const movies = popularMoviesResponse.data.results ?? [];
    const renderedApp = renderToString(<App initialMovies={movies} />);

    const renderedHTMLWithInitialData = template.replace(
      "<!--{INIT_DATA_AREA}-->",
      /*html*/ `
    <script>
      window.__INITIAL_DATA__ = {
        movies: ${JSON.stringify(movies ?? [])}
      }
    </script>
  `
    );

    const ogTags = generateOGTags({
      title: "세오의 추천 영화",
      description: "세오가 추천하는 인기 영화들을 확인하세요",
      url: `https://attractive-embrace-production.up.railway.app/`,
      image: `https://image.tmdb.org/t/p/w500${movies[0].poster_path || ""}`,
    });

    const renderedHTMLWithOG = renderedHTMLWithInitialData.replace(
      "<!--{OG_TAGS}-->",
      ogTags
    );

    const renderedHTML = renderedHTMLWithOG.replace(
      "<!--{BODY_AREA}-->",
      renderedApp
    );

    res.send(renderedHTML);
  } catch (error) {
    console.error("Error during server-side rendering:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/detail:id", async (req: Request, res: Response) => {
  try {
    const template = generateHTML();
    const { id } = req.params;
    const [popularMoviesResponse, popularMovieDetailResponse] =
      await Promise.all([
        moviesApi.getPopular(),
        moviesApi.getDetail(Number(id)),
      ]);
    const popularMovies = Array.isArray(popularMoviesResponse?.data.results)
      ? popularMoviesResponse.data.results
      : [];
    const movieDetail = popularMovieDetailResponse.data ?? null;
    const renderedApp = renderToString(<App initialMovies={popularMovies} />);

    const ogTags = generateOGTags({
      title: `${movieDetail?.title || "영화 상세"}`,
      description: movieDetail?.overview || "영화 상세 정보를 확인하세요",
      url: `https://rendering-basecamp-production-f101.up.railway.app/detail/${id}`,
      image: `https://image.tmdb.org/t/p/w500${movieDetail?.poster_path || ""}`,
    });

    const renderedHTMLWithInitialData = template.replace(
      "<!--{INIT_DATA_AREA}-->",
      /*html*/ `
    <script>
      window.__INITIAL_DATA__ = {
        movies: ${JSON.stringify(popularMovies ?? [])}
        detail: ${JSON.stringify(movieDetail)}
      }
    </script>
  `
    );

    const renderedHTMLWithOG = renderedHTMLWithInitialData.replace(
      "<!--{OG_TAGS}-->",
      ogTags
    );

    const renderedHTML = renderedHTMLWithOG.replace(
      "<!--{BODY_AREA}-->",
      renderedApp
    );

    res.send(renderedHTML);
  } catch (error) {
    console.error("Error during server-side rendering:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
