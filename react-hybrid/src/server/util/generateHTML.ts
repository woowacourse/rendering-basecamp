import { MovieDetailResponse } from "../../client/types/MovieDetail.types";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const VERSION = "REACT HYBRID";

const generateHTML = () => {
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
};
const generateMeta = (movieDetailResponse?: MovieDetailResponse) => {
  if (!movieDetailResponse) {
    return `
        <title>마빈의 영화 리뷰</title>
        <meta property="og:title" content="마빈의 영화 리뷰 | ${VERSION}" />
        <meta property="og:description" content="마빈의 영화 리뷰1 !!!! " />
        <meta property="og:image" content="/images/logo.png" />
      `;
  }
  return `
      <title>${movieDetailResponse.title} | ${VERSION}</title>
      <meta property="og:title" content="${
        "마빈의 영화 리뷰 | " + movieDetailResponse.title
      }" />
      <meta
        property="og:description"
        content="${movieDetailResponse.overview}"
      />
      <meta
        property="og:image"
        content="${
          movieDetailResponse.poster_path
            ? IMAGE_BASE_URL + movieDetailResponse.poster_path
            : "/images/no-poster.png"
        }"
      />
    `;
};

export const injectDataToTemplate = (
  renderedApp: string,
  initialData: any,
  movieDetailResponse?: MovieDetailResponse
) => {
  const template = generateHTML();

  const htmlWithInitialData = template.replace(
    "<!--{INIT_DATA_AREA}-->",
    /*html*/ `
    <script>
      window.__INITIAL_DATA__ = ${JSON.stringify(initialData)}
    </script>
  `
  );

  const htmlWithBody = htmlWithInitialData.replace(
    "<!--{BODY_AREA}-->",
    renderedApp
  );

  const finalHTML = htmlWithBody.replace(
    "<!--{OG_TAGS}-->",
    /*html*/ `
    ${generateMeta(movieDetailResponse)}
  `
  );

  return finalHTML;
};
