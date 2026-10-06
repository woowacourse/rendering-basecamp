import { escapeHtml } from "../utils/escapeHtml";

interface LayoutOptions {
  title: string;
  description: string;
  ogTitle?: string;
  ogImage?: string;
  body: string;
}

/**
 * <html>, <head>, <body>로 페이지 전체를 감싼다.
 * <head>에는 title, description, og 태그를 넣는다.
 */
export const renderLayout = ({
  title,
  description,
  ogTitle = title,
  ogImage,
  body,
}: LayoutOptions) => /*html*/ `<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeHtml(ogTitle)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    ${ogImage ? `<meta property="og:image" content="${escapeHtml(ogImage)}" />` : ""}
    <link rel="stylesheet" href="/styles/index.css" />
  </head>
  <body>
    ${body}
  </body>
</html>`;

/**
 * 에러 상황에서 안내 문구 한 줄만 보여주는 페이지
 */
export const renderMessagePage = (message: string) =>
  renderLayout({
    title: "영화 리뷰",
    description: message,
    body: `<p>${escapeHtml(message)}</p>`,
  });
