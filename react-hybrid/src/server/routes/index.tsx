import { Request, Response, Router } from "express";
import { renderToString } from "react-dom/server";
import { moviesApi } from "../../client/api/movies";
import App from "../../client/App";
import { MovieItem } from "../../client/types/Movie.types";
import { MovieDetailResponse } from "../../client/types/MovieDetail.types";
import { getOGMetaTagsHTML } from "../utils/getOGMetaTagsHTML";
import { getUrl } from "../utils/getUrl";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const movies = await fetchPopularMovies();
  const topMovie = movies[0];

  const html = await renderPage(req, {
    routeType: "home",
    initialData: { movies },
    ogTarget: topMovie,
  });

  res.send(html);
});

router.get("/detail/:id", async (req: Request, res: Response) => {
  const movieId = Number(req.params.id);
  const { movies, selectedMovieDetail } = await fetchMovieDetailPageData(
    movieId
  );

  const html = await renderPage(req, {
    routeType: "detail",
    initialData: { movies, selectedMovieDetail },
    ogTarget: selectedMovieDetail,
  });

  res.send(html);
});

export default router;

async function renderPage(
  req: Request,
  {
    routeType,
    initialData,
    ogTarget,
  }: {
    routeType: "home" | "detail";
    initialData: {
      movies: MovieItem[];
      selectedMovieDetail?: MovieDetailResponse;
    };
    ogTarget: MovieItem | MovieDetailResponse;
  }
): Promise<string> {
  const appHTML = renderToString(
    <App routeType={routeType} initialData={initialData} />
  );
  const ogTagsHTML = buildOGTags(req, ogTarget);
  const initialDataScript = buildInitialDataScript(routeType, initialData);

  return injectHTMLParts({
    template: getBaseHTMLTemplate(),
    ogTags: ogTagsHTML,
    body: appHTML,
    initialData: initialDataScript,
  });
}

async function fetchPopularMovies(): Promise<MovieItem[]> {
  const response = await moviesApi.getPopular();
  return response?.data.results ?? [];
}

async function fetchMovieDetailPageData(movieId: number): Promise<{
  movies: MovieItem[];
  selectedMovieDetail: MovieDetailResponse;
}> {
  const [{ data: popularData }, { data: selectedMovieDetail }] =
    await Promise.all([moviesApi.getPopular(), moviesApi.getDetail(movieId)]);

  return {
    movies: popularData.results ?? [],
    selectedMovieDetail,
  };
}

function buildOGTags(req: Request, movie: MovieItem | MovieDetailResponse) {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
    : "/images/no_image.png";

  return getOGMetaTagsHTML({
    title: movie.title || "영화 추천 사이트",
    description: movie.overview || "최신 인기 영화와 상세 정보를 확인해보세요.",
    url: getUrl(req),
    image: imageUrl,
  });
}

function buildInitialDataScript(
  routeType: "home" | "detail",
  initialData: {
    movies: MovieItem[];
    selectedMovieDetail?: MovieDetailResponse;
  }
) {
  return /*html*/ `
    <script>
      window.__INITIAL_DATA__ = ${JSON.stringify({ routeType, initialData })};
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

function getBaseHTMLTemplate() {
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
