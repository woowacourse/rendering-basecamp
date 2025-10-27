import { Request, Response, Router } from "express";
import { renderToString } from "react-dom/server";
import { moviesApi } from "../../client/api/movies";
import MovieDetailPage from "../../client/pages/MovieDetailPage";
import MovieHomePage from "../../client/pages/MovieHomePage";

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
    const movieResponse = await moviesApi.getPopular();
    const movies = movieResponse.data.results;
    const topMovie = movies[0];

    const template = generateHTML();

    const renderedApp = renderToString(<MovieHomePage movies={movies} />);

    const ogTags = `
      <meta property="og:title" content="인기 영화 리뷰" />
      <meta property="og:description" content="현재 가장 인기 있는 영화를 만나보세요." />
      <meta property="og:image" content="https://image.tmdb.org/t/p/w500${topMovie.poster_path}" />
      <meta property="og:url" content="https://localhost:3000/" />
      <meta name="twitter:card" content="summary_large_image" />
    `;

    const htmlWithData = template
      .replace("<!--{OG_TAGS}-->", ogTags)
      .replace(
        "<!--{INIT_DATA_AREA}-->",
        `<script>
          window.__INITIAL_DATA__ = { movies: ${JSON.stringify(movies)} }
        </script>`
      )
      .replace("<!--{BODY_AREA}-->", renderedApp);

    res.send(htmlWithData);
  } catch (error) {
    console.error("Error fetching movies:", error);
    const errorHTML = generateHTML()
      .replace("<!--{BODY_AREA}-->", "<div>영화 정보를 불러오는데 실패했습니다.</div>")
      .replace(
        "<!--{INIT_DATA_AREA}-->",
        `<script>window.__INITIAL_DATA__ = { movies: [] }</script>`
      )
      .replace(
        "<!--{OG_TAGS}-->",
        `<meta property="og:title" content="영화 정보를 불러올 수 없습니다." />`
      );
    res.send(errorHTML);
  }
});

router.get("/detail/:movieId", async (req: Request, res: Response) => {
  try {
    const { movieId } = req.params;

    const [moviesResponse, detailResponse] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(Number(movieId)),
    ]);
    const movies = moviesResponse.data.results;
    const movieDetail = detailResponse.data;

    const template = generateHTML();

    const renderedApp = renderToString(
      <MovieDetailPage movies={movies} detail={movieDetail} />
    );

    const ogTags = `
      <meta property="og:title" content="${movieDetail.title}" />
      <meta property="og:description" content="${movieDetail.overview || "영화 상세 정보를 확인하세요."}" />
      <meta property="og:image" content="https://image.tmdb.org/t/p/w500${movieDetail.poster_path}" />
      <meta property="og:url" content="https://localhost:3000/detail/${movieId}" />
      <meta name="twitter:card" content="summary_large_image" />
    `;

    const htmlWithData = template
      .replace("<!--{OG_TAGS}-->", ogTags)
      .replace(
        "<!--{INIT_DATA_AREA}-->",
        `<script>
          window.__INITIAL_DATA__ = {
            movies: ${JSON.stringify(movies)},
            detail: ${JSON.stringify(movieDetail)}
          }
        </script>`
      )
      .replace("<!--{BODY_AREA}-->", renderedApp);

    res.send(htmlWithData);
  } catch (error) {
    console.error("Error fetching movie detail:", error);
    const errorHTML = generateHTML()
      .replace(
        "<!--{BODY_AREA}-->",
        "<div>영화 정보를 불러오는데 실패했습니다.</div>"
      )
      .replace(
        "<!--{INIT_DATA_AREA}-->",
        `<script>window.__INITIAL_DATA__ = { movies: [], movieDetail: null }</script>`
      )
      .replace(
        "<!--{OG_TAGS}-->",
        `<meta property="og:title" content="영화 정보를 불러올 수 없습니다." />`
      );
    res.send(errorHTML);
  }
});

export default router;
