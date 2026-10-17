import type { InitialData } from "../../client/types/InitialData.types";

const STYLESHEETS = [
  "reset",
  "colors",
  "text",
  "main",
  "thumbnail",
  "modal",
  "animation",
  "media",
];

// </script> 같은 문자열이 데이터에 섞여 있어도 스크립트 태그가 닫히지 않도록 < 를 이스케이프한다.
const serializeData = (data: unknown) =>
  JSON.stringify(data).replace(/</g, "\\u003c");

interface LayoutProps {
  title: string;
  head?: string;
  appHtml: string;
  initialData?: InitialData;
}

export const renderLayout = ({ title, head = "", appHtml, initialData }: LayoutProps) => /*html*/ `<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${STYLESHEETS.map((name) => `<link rel="stylesheet" href="/static/styles/${name}.css" />`).join("\n    ")}
    <title>${title}</title>${head}
  </head>
  <body>
    <div id="root">${appHtml}</div>
    ${
      initialData
        ? `<script>window.__INITIAL_DATA__ = ${serializeData(initialData)};</script>
    <script src="/static/bundle.js" defer></script>`
        : ""
    }
  </body>
</html>`;
