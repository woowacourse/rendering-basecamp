import { Router, type Request, type Response } from "express";

import { renderToString } from "react-dom/server";
import App from "../../client/App";
import { moviesApi } from "../../client/api/movies";

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

router.get("/", async (_: Request, res: Response) => {
  try {
    const template = generateHTML();

    const popularMoviesResponse = await moviesApi.getPopular();
    const movies = popularMoviesResponse.data.results ?? [];
    const renderedApp = renderToString(<App initialMovie={movies} />);
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
    const renderedHTML = renderedHTMLWithInitialData.replace(
      "<!--{BODY_AREA}-->",
      renderedApp
    );

    res.send(renderedHTML);
  } catch (error) {}
});

export default router;
