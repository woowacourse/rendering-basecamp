import { renderToString } from "react-dom/server";
import App, { type Page } from "../client/App";
import { serializeInitialData } from "../client/initialData";

const SITE_NAME = "영화 리뷰";

export const renderDocument = (page: Page) => {
  const appHtml = renderToString(<App page={page} />);

  return /*html*/ `<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/static/styles/index.css" />
    <title>${SITE_NAME}</title>
  </head>
  <body>
    <div id="root">${appHtml}</div>
    ${serializeInitialData(page)}
    <script src="/static/bundle.js"></script>
  </body>
</html>`;
};
