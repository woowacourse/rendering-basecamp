import { Router, Request, Response } from "express";
import { renderToString } from "react-dom/server";
import { moviesApi } from "../../client/api/movies";
import MovieDetailPage from "../../client/pages/MovieDetailPage";
import { OverlayProvider } from "overlay-kit";

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
    <OverlayProvider>
      <MovieDetailPage
        movie={movie.data}
        moviesServerData={movies.data.results}
      />
    </OverlayProvider>
  );

  const renderedHTMLWithInitialData = template.replace(
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
