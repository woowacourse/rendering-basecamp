import { escapeHtml } from "../utils/escapeHtml";

export interface PageMeta {
  description: string;
  og: {
    type: "website" | "video.movie";
    url: string;
    image: string;
  };
}

interface LayoutProps {
  title: string;
  meta?: PageMeta;
  body: string;
}

const renderMeta = (title: string, { description, og }: PageMeta) => /*html*/ `
    <meta name="description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="${og.type}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${escapeHtml(og.image)}" />
    <meta property="og:url" content="${escapeHtml(og.url)}" />`;

export const renderLayout = ({ title, meta, body }: LayoutProps) => /*html*/ `<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>${meta ? renderMeta(title, meta) : ""}
    <link rel="stylesheet" href="/styles/index.css" />
  </head>
  <body>
    ${body}
  </body>
</html>
`;
