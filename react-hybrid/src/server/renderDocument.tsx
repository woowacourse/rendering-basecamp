import { renderToString } from "react-dom/server";
import App, { type Page } from "../client/App";
import { SITE_NAME } from "../client/constants/site";
import { serializeInitialData } from "../client/initialData";
import { escapeHtml } from "./escapeHtml";

interface DocumentHead {
  title?: string;
  headTags?: string;
}

export const renderDocument = (
  page: Page,
  { title = SITE_NAME, headTags = "" }: DocumentHead = {}
) => {
  const appHtml = renderToString(<App page={page} />);

  return /*html*/ `<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/static/styles/index.css" />
    <title>${escapeHtml(title)}</title>
    ${headTags}
  </head>
  <body>
    <div id="root">${appHtml}</div>
    ${serializeInitialData(page)}
    <script src="/static/bundle.js"></script>
  </body>
</html>`;
};
