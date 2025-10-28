import { Router, Request, Response } from "express";

import { renderToString } from "react-dom/server";
import App from "../../client/App";
import { moviesApi } from "../../client/api/movies";
import { createSEO } from "../../client/utils/createSEO";

const router = Router();

function generateHTML() {
  return /*html*/ `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/static/styles/index.css" />
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
  const {
    data: { results: movies },
  } = await moviesApi.getPopular();
  const firstMovie = movies[0];
  const imagePath = firstMovie.poster_path;
  const template = generateHTML();

  const renderedApp = renderToString(<App initialMovies={movies} />);

  const renderedHTMLWithInitialData = template.replace(
    "<!--{INIT_DATA_AREA}-->",
    /*html*/ `
    <script>
      window.__INITIAL_DATA__ = {
        movies: ${JSON.stringify(movies)}
      }
    </script>
  `
  );
  const renderedHTML = renderedHTMLWithInitialData.replace(
    "<!--{BODY_AREA}-->",
    renderedApp
  );

  const seoHTML = renderedHTML.replace(
    "<!--{OG_TAGS}-->",
    createSEO({
      title: "영화 리뷰",
      description: "영화 리뷰",
      ogType: "video.movie",
      ogTitle: "영화 리뷰",
      ogDescription: "보고싶은 영화의 리뷰를 확인하세요",
      ogImage: `https://image.tmdb.org/t/p/w1280${imagePath}`,
      ogUrl: "https://www.example.com",
    })
  );

  res.send(seoHTML);
});

router.get("/detail/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const template = generateHTML();

  const [popularResponse, detailResponse] = await Promise.all([
    moviesApi.getPopular(),
    moviesApi.getDetail(Number(id)),
  ]);

  const movies = popularResponse.data?.results ?? [];
  const detail = detailResponse.data ?? null;

  const renderedApp = renderToString(
    <App initialMovies={movies} initialDetail={detail} />
  );

  const initialData = { movies, detail };
  const ogImageUrl = `https://image.tmdb.org/t/p/w500${detail?.poster_path}`;

  const renderedHTMLWithInitialData = template.replace(
    "<!--{INIT_DATA_AREA}-->",
    /*html*/ `
      <script>
        window.__INITIAL_DATA__ = ${JSON.stringify(initialData)}
      </script>
    `
  );

  const renderedHTML = renderedHTMLWithInitialData.replace(
    "<!--{BODY_AREA}-->",
    renderedApp
  );

  const seoHTML = renderedHTML.replace(
    "<!--{OG_TAGS}-->",
    createSEO({
      title: `${detail?.title} - 영화 리뷰`,
      description: `${detail?.overview}`,
      ogType: "video.movie",
      ogTitle: detail?.title,
      ogDescription: detail?.overview,
      ogImage: ogImageUrl,
      ogUrl: req.url,
    })
  );

  res.send(seoHTML);
});

export default router;
