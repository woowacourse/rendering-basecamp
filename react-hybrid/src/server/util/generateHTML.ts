import { MovieDetailResponse } from "../../client/types/MovieDetail.types";

interface HydrationData {
  Component: string;
  props: any;
}

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const VERSION = "REACT HYBRID";

const createHTMLTemplate = () => {
  return `
      <!DOCTYPE html>
      <html lang="ko">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="stylesheet" href="/static/styles/index.css" />
          <!--{META_TAGS}-->
        </head>
        <body>
          <div id="root"><!--{APP_CONTENT}--></div>
          <!--{INITIAL_STATE}-->
          <script src="/static/bundle.js"></script>
        </body>
      </html>
      `;
};

const createMetaTags = (movie?: MovieDetailResponse) => {
  if (!movie) {
    return `
        <title>마빈의 영화 리뷰 | ${VERSION} </title>
        <meta property="og:title" content="마빈의 영화 리뷰 | ${VERSION}" />
        <meta property="og:description" content="마빈의 영화 리뷰1 !!!! " />
        <meta property="og:image" content="/images/logo.png" />
      `;
  }

  const posterUrl = movie.poster_path
    ? IMAGE_BASE_URL + movie.poster_path
    : "/images/no-poster.png";

  return `
      <title>${movie.title} | ${VERSION}</title>
      <meta property="og:title" content="마빈의 영화 리뷰 | ${movie.title}" />
      <meta property="og:description" content="${movie.overview}" />
      <meta property="og:image" content="${posterUrl}" />
    `;
};

const createInitialStateScript = (hydrationData: HydrationData) => {
  return `<script>
            window.__INITIAL_DATA__ = ${JSON.stringify(hydrationData)}
          </script>`;
};

export const injectDataToTemplate = (
  appContent: string,
  hydrationData: HydrationData,
  movieDetail?: MovieDetailResponse
) => {
  const htmlTemplate = createHTMLTemplate();

  return htmlTemplate
    .replace("<!--{INITIAL_STATE}-->", createInitialStateScript(hydrationData))
    .replace("<!--{APP_CONTENT}-->", appContent)
    .replace("<!--{META_TAGS}-->", createMetaTags(movieDetail));
};
