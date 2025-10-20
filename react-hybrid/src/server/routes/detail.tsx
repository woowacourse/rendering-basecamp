import { Request, Response, Router } from "express";
import { renderToString } from "react-dom/server";
import { moviesApi } from "../../client/api/movies";
import App from "../../client/App";

const router = Router();

function generateHTML() {
  return /*html*/ `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/static/styles/index.css" />
        <title>영화 상세 정보</title>
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

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const template = generateHTML();

  const movies = await moviesApi.getPopular();
  const movie = await moviesApi.getDetail(Number(id));

  const renderedApp = renderToString(
    <App initialData={{ movie: movie.data, movies: movies.data.results }} />
  );

  const movieData = movie.data;
  const imageUrl = movieData.poster_path
    ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
    : "";

  const ogTags = /*html*/ `
    <meta property="og:type" content="video.movie" />
    <meta property="og:title" content="${movieData.title} - 영화 리뷰" />
    <meta property="og:description" content="${
      movieData.overview || "영화 상세 정보를 확인해보세요."
    }" />
    <meta property="og:url" content="${req.protocol}://${req.get("host")}${
    req.originalUrl
  }" />
    <meta property="og:site_name" content="영화 리뷰" />
    ${imageUrl ? `<meta property="og:image" content="${imageUrl}" />` : ""}
    ${imageUrl ? `<meta property="og:image:width" content="500" />` : ""}
    ${imageUrl ? `<meta property="og:image:height" content="750" />` : ""}
    <meta name="description" content="${
      movieData.overview || "영화 상세 정보를 확인해보세요."
    }" />
    <meta name="keywords" content="영화, 영화리뷰, ${movieData.title}" />
  `;

  const renderedHTMLWithOgTags = template.replace("<!--{OG_TAGS}-->", ogTags);

  const renderedHTMLWithInitialData = renderedHTMLWithOgTags.replace(
    "<!--{INIT_DATA_AREA}-->",
    /*html*/ `
    <script>
      window.__INITIAL_DATA__ = {
        movie: ${JSON.stringify(movie.data)},
        movies: ${JSON.stringify(movies.data.results)}
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
