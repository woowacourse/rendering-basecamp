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

router.get("/", async (req: Request, res: Response) => {
  const template = generateHTML();

  const movies = await moviesApi.getPopular();

  const renderedApp = renderToString(
    <App initialData={{ movies: movies.data.results }} />
  );

  const ogTags = /*html*/ `
    <meta property="og:type" content="website" />
    <meta property="og:title" content="영화 리뷰 - 인기 영화 목록" />
    <meta property="og:description" content="최신 인기 영화를 확인하고 리뷰를 작성해보세요." />
    <meta property="og:url" content="${req.protocol}://${req.get("host")}${
    req.originalUrl
  }" />
    <meta property="og:site_name" content="영화 리뷰" />
    <meta name="description" content="최신 인기 영화를 확인하고 리뷰를 작성해보세요." />
    <meta name="keywords" content="영화, 영화리뷰, 인기영화, 최신영화" />
  `;

  const renderedHTMLWithOgTags = template.replace("<!--{OG_TAGS}-->", ogTags);

  const renderedHTMLWithInitialData = renderedHTMLWithOgTags.replace(
    "<!--{INIT_DATA_AREA}-->",
    /*html*/ `
    <script>
      window.__INITIAL_DATA__ = {
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
