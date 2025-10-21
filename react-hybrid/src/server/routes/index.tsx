import { Request, Response, Router } from "express";

import { renderToString } from "react-dom/server";
import { moviesApi } from "../../client/api/movies";
import App from "../../client/App";
import { getOGMetaTagsHTML } from "../utils/getOGMetaTagsHTML";
import { getUrl } from "../utils/getUrl";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const popularResponse = await moviesApi.getPopular();
  const movies = popularResponse?.data.results;
  const topMovie = movies[0];

  const topMovieImageUrl = topMovie.poster_path
    ? `https://image.tmdb.org/t/p/original${topMovie.poster_path}`
    : "/images/no_image.png";

  const template = generateHTML();

  const templateWithOGTags = template.replace(
    "<!--{OG_TAGS}-->",
    getOGMetaTagsHTML({
      title: "영화 추천 사이트",
      description: `현재 인기 영화: ${topMovie.title}. ${
        topMovie.overview || "최신 인기 영화를 확인해보세요."
      }`,
      url: getUrl(req),
      image: topMovieImageUrl,
    })
  );

  const renderedHTMLWithInitialData = templateWithOGTags.replace(
    "<!--{INIT_DATA_AREA}-->",
    /*html*/ `
    <script>
      window.__INITIAL_DATA__ = { movies: ${JSON.stringify(movies)} }
    </script>
  `
  );

  const renderedApp = renderToString(<App movies={movies} />);

  const renderedHTML = renderedHTMLWithInitialData.replace(
    "<!--{BODY_AREA}-->",
    renderedApp
  );

  res.send(renderedHTML);
});

export default router;

function generateHTML() {
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
