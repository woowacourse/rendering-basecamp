import { Router, Request, Response } from "express";
import { renderToString } from "react-dom/server";
import React from "react";
import App from "../../client/App";
import { moviesApi } from "../../shared/api/movies";

const router = Router();

function generateHTML(bodyContent: string, initialData: any, ogTags: string = "") {
  return `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/static/styles/index.css" />
        <title>영화 리뷰</title>
        ${ogTags}
      </head>
      <body>
        <div id="root">${bodyContent}</div>
        <script>
          window.__INITIAL_DATA__ = ${JSON.stringify(initialData)};
        </script>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
  `;
}

router.get("/", async (_: Request, res: Response) => {
  try {
    const response = await moviesApi.getPopular(1);
    const movies = response.data.results;

    const initialData = {
      movies,
      url: "/",
    };

    const renderedApp = renderToString(<App url="/" />);

    const html = generateHTML(renderedApp, initialData);
    res.send(html);
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/detail/:movieId", async (req: Request, res: Response) => {
  try {
    const { movieId } = req.params;

    const [moviesResponse, detailResponse] = await Promise.all([
      moviesApi.getPopular(1),
      moviesApi.getDetail(Number(movieId)),
    ]);

    const movies = moviesResponse.data.results;
    const movieDetail = detailResponse.data;

    const initialData = {
      movies,
      movieDetail,
      url: `/detail/${movieId}`,
    };

    const renderedApp = renderToString(<App url={`/detail/${movieId}`} />);

    const description = movieDetail.overview || '영화 상세 정보';
    const imageUrl = movieDetail.poster_path
      ? `https://image.tmdb.org/t/p/w1280${movieDetail.poster_path}`
      : '';
    const baseUrl = process.env.BASE_URL || 'http://localhost:8080';

    const ogTags = `
      <title>${movieDetail.title} - Movie App</title>
      <meta name="description" content="${description}" />

      <meta property="og:type" content="website" />
      <meta property="og:title" content="${movieDetail.title}" />
      <meta property="og:description" content="${description}" />
      <meta property="og:image" content="${imageUrl}" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content="${baseUrl}/detail/${movieId}" />
      <meta property="og:site_name" content="Movie App" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${movieDetail.title}" />
      <meta name="twitter:description" content="${description}" />
      <meta name="twitter:image" content="${imageUrl}" />
    `;

    const html = generateHTML(renderedApp, initialData, ogTags);
    res.send(html);
  } catch (error) {
    console.error("Error fetching movie detail:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
