import { createElement } from "react";
import { renderToString } from "react-dom/server";
import App, { type AppProps } from "../client/App";
import type { MovieDetailResponse } from "../client/types/MovieDetail.types";

function escapeHTML(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function createHomeMetadata() {
  const siteUrl = process.env.SITE_URL;

  return {
    title: "영화 리뷰",
    description: "인기 영화를 둘러보고 영화 정보와 평점을 확인하세요.",
    pageUrl: new URL("/", siteUrl).href,
    imageUrl: new URL("/static/images/no_image.png", siteUrl).href,
  };
}

function createDetailMetadata(detailMovie: MovieDetailResponse) {
  const title = `${detailMovie.title} | 영화 리뷰`;
  const description = detailMovie.overview;
  const siteUrl = process.env.SITE_URL;
  const pageUrl = new URL(`/detail/${detailMovie.id}`, siteUrl).href;
  const imagePath = detailMovie.backdrop_path || detailMovie.poster_path;
  const imageUrl = imagePath
    ? new URL(
        imagePath.replace(/^\/+/, ""),
        "https://image.tmdb.org/t/p/original/",
      ).href
    : new URL("/static/images/no_image.png", siteUrl).href;


  return { title, description, pageUrl, imageUrl };
}

export function renderPage({ movies, detailMovie = null }: AppProps) {
  const initialData = { movies, detailMovie };
  const renderedApp = renderToString(createElement(App, initialData));
  const serializedData = JSON.stringify(initialData).replace(/</g, "\\u003c");

  const { title, description, pageUrl, imageUrl } = detailMovie
    ? createDetailMetadata(detailMovie)
    : createHomeMetadata();

  return `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/static/styles/index.css" />
        <title>${escapeHTML(title)}</title>
        <meta name="description" content="${escapeHTML(description)}" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="영화 리뷰" />
        <meta property="og:locale" content="ko_KR" />
        <meta property="og:title" content="${escapeHTML(title)}" />
        <meta property="og:description" content="${escapeHTML(description)}" />
        <meta property="og:url" content="${escapeHTML(pageUrl)}" />
        <meta property="og:image" content="${escapeHTML(imageUrl)}" />
        <link rel="canonical" href="${escapeHTML(pageUrl)}" />
      </head>
      <body>
        <div id="root">${renderedApp}</div>
        <script>window.__INITIAL_DATA__ = ${serializedData};</script>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
  `;
}
