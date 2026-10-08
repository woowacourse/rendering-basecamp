import { escapeHtml } from "../utils/escapeHtml";

export interface PageMeta {
  title: string;
  description: string;
  url: string;
  image?: string;
}

const head = ({ title, description, url, image }: PageMeta) => /*html*/ `
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/styles/index.css" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${escapeHtml(url)}" />
    ${image ? `<meta property="og:image" content="${escapeHtml(image)}" />` : ""}
    <meta name="twitter:card" content="summary_large_image" />`;

export const layout = (meta: PageMeta, body: string) => /*html*/ `<!DOCTYPE html>
<html lang="ko">
  <head>${head(meta)}
  </head>
  <body>${body}
  </body>
</html>`;
