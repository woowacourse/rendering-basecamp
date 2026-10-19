import { Router, Request, Response } from "express";
import { isAxiosError } from "axios";
import { apiClient } from "../../client/lib/apiClient";
import { renderToString } from "react-dom/server";
import App from "../../client/App";
import React from "react";
import type { MovieResponse } from "../../client/types/Movie.types";
import type { MovieDetailResponse } from "../../client/types/MovieDetail.types";
import type { InitialData } from "../../client/types/InitialData.types";

const router = Router();

function generateHTML() {
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
}

router.get(["/", "/detail/:movieId"], async (req: Request, res: Response) => {
  const { movieId } = req.params;

  if (
    movieId !== undefined &&
    (typeof movieId !== "string" ||
      !/^[1-9]\d*$/.test(movieId) ||
      !Number.isSafeInteger(Number(movieId)))
  ) {
    res.status(400).send("올바른 영화 ID가 아닙니다.");
    return;
  }

  try {
    const [response, detailResponse] = await Promise.all([
      apiClient.get<MovieResponse>("/movie/popular", {
        params: { language: "ko-KR" },
      }),
      movieId
        ? apiClient.get<MovieDetailResponse>(`/movie/${movieId}`, {
            params: { language: "ko-KR" },
          })
        : Promise.resolve(null),
    ]);
    const initialData: InitialData = {
      movies: response.data.results,
      movieDetail: detailResponse?.data ?? null,
    };

    const template = generateHTML();

    const renderedApp = renderToString(<App {...initialData} />);

    const renderedHTMLWithInitialData = template.replace(
      "<!--{INIT_DATA_AREA}-->",
      /*html*/ `
        <script>
          window.__INITIAL_DATA__ = ${JSON.stringify(initialData).replace(/</g, "\\u003c")};
        </script>
      `,
    );

    const renderedHTML = renderedHTMLWithInitialData.replace(
      "<!--{BODY_AREA}-->",
      renderedApp,
    );

    res.send(renderedHTML);
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      res.status(404).send("영화를 찾을 수 없습니다.");
      return;
    }

    res.status(502).send("영화 정보를 불러오지 못했습니다.");
  }
});

router.get("/api/movies/:movieId", async (req, res) => {
  const { movieId } = req.params;
  const page = Number(req.query.page ?? 1);

  if (movieId !== "popular" && !/^[1-9]\d*$/.test(movieId)) {
    res.status(400).json({ message: "올바른 영화 ID가 아닙니다." });
    return;
  }

  if (!Number.isSafeInteger(page) || page < 1) {
    res.status(400).json({ message: "올바른 페이지 번호가 아닙니다." });
    return;
  }

  try {
    const response = await apiClient.get(`/movie/${movieId}`, {
      params: {
        language: "ko-KR",
        ...(movieId === "popular" ? { page } : {}),
      },
    });

    res.json(response.data);
  } catch {
    res.status(502).json({ message: "영화 정보를 불러오지 못했습니다." });
  }
});

export default router;
