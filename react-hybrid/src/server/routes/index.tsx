import { Request, Response, Router } from "express";

import { renderToString } from "react-dom/server";
import { moviesApi } from "../../client/api/movies";
import App from "../../client/App";
import { MovieItem } from "../../client/types/Movie.types";
import { getOGMetaTagsHTML } from "../utils/getOGMetaTagsHTML";
import { getUrl } from "../utils/getUrl";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const movies = await fetchPopularMovies();
  const topMovie = movies[0];

  const renderedApp = renderApp(movies);

  const ogTagsHTML = buildOGTags(req, topMovie);
  const initialDataScript = buildInitialDataScript(movies);

  const finalHTML = injectHTMLParts({
    template: generateHTMLTemplate(),
    body: renderedApp,
    ogTags: ogTagsHTML,
    initialData: initialDataScript,
  });

  res.send(finalHTML);
});

async function fetchPopularMovies() {
  const response = await moviesApi.getPopular();
  return response?.data.results ?? [];
}

function renderApp(movies: MovieItem[]) {
  return renderToString(<App movies={movies} />);
}

function buildOGTags(req: Request, topMovie: MovieItem) {
  const topMovieImageUrl = topMovie.poster_path
    ? `https://image.tmdb.org/t/p/original${topMovie.poster_path}`
    : "/images/no_image.png";

  return getOGMetaTagsHTML({
    title: "영화 추천 사이트",
    description: `현재 인기 영화: ${topMovie.title}. ${
      topMovie?.overview || "최신 인기 영화를 확인해보세요."
    }`,
    url: getUrl(req),
    image: topMovieImageUrl,
  });
}

function buildInitialDataScript(movies: MovieItem[]) {
  return /*html*/ `
    <script>
      window.__INITIAL_DATA__ = { movies: ${JSON.stringify(movies)} };
    </script>
  `;
}

function injectHTMLParts({
  template,
  ogTags,
  body,
  initialData,
}: {
  template: string;
  ogTags: string;
  body: string;
  initialData: string;
}) {
  return template
    .replace("<!--{OG_TAGS}-->", ogTags)
    .replace("<!--{BODY_AREA}-->", body)
    .replace("<!--{INIT_DATA_AREA}-->", initialData);
}

function generateHTMLTemplate() {
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
