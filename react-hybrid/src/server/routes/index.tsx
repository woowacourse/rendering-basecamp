import { Router, Request, Response } from "express";
import { renderToString } from "react-dom/server";
import App from "../../client/App";
import { moviesApi } from "../../client/api/movies";
import { generateOGTags } from "../../client/utils/generateOGTags";

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

router.get("/", async (_: Request, res: Response) => {
  try {
    const template = generateHTML();
    const popularResponse = await moviesApi.getPopular();
    const popularMovies = popularResponse.data.results;

    const renderedApp = renderToString(<App initialData={popularMovies} />);

    const ogTags = generateOGTags({
      title: "영화 리뷰 - 인기 영화",
      description: "지금 인기 있는 영화를 확인하세요",
      url: "https://rendering-basecamp-production-f101.up.railway.app/",
      image: `https://image.tmdb.org/t/p/w500${
        popularMovies[0]?.poster_path || ""
      }`,
    });

    const renderedHTMLWithInitialData = template.replace(
      "<!--{INIT_DATA_AREA}-->",
      /*html*/ `
    <script>
      window.__INITIAL_DATA__ = {
        movies: ${JSON.stringify(popularMovies)}
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
  } catch (e) {
    console.error(e);
    res.status(500).send("Server Error");
  }
});

router.get("/detail/:id", async (req: Request, res: Response) => {
  try {
    const template = generateHTML();
    const movieId = Number(req.params.id);

    const [popularResponse, detailResponse] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(movieId),
    ]);

    const popularMovies = popularResponse.data.results ?? [];
    const movieDetail = detailResponse.data ?? null;

    const renderedApp = renderToString(
      <App initialData={popularMovies} movieDetail={movieDetail} />
    );

    const ogTags = generateOGTags({
      title: `${movieDetail?.title || "영화 상세"}`,
      description: movieDetail?.overview || "영화 상세 정보를 확인하세요",
      url: `https://rendering-basecamp-production-f101.up.railway.app/detail/${movieId}`,
      image: `https://image.tmdb.org/t/p/w500${movieDetail?.poster_path || ""}`,
    });

    const renderedHTMLWithInitialData = template.replace(
      "<!--{INIT_DATA_AREA}-->",
      /*html*/ `
    <script>
      window.__INITIAL_DATA__ = {
        movie: ${JSON.stringify(popularMovies)},
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
  } catch (e) {
    console.error(e);
    res.status(500).send("Server Error");
  }
});

export default router;
