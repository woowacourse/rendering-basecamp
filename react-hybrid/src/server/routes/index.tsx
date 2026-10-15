import { Router, Request, Response } from "express";

import { renderToString } from "react-dom/server";
import App from "../../client/App";
import React from "react";
import { moviesApi } from "../api/movies";

const router = Router(); // Router는 왜한거지?

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
        <div id="wrap">
          <div id="root"><!--{BODY_AREA}--></div>
          <!--{INIT_DATA_AREA}-->
          <script src="/static/bundle.js"></script>
        </div>
      </body>
    </html>
    `;
}

router.get("/", async (_: Request, res: Response) => {
  // 일단 HTML 템플릿을 하나 만듦
  const template = generateHTML();

  // TMDB에 api 요청
  const response = await moviesApi.getPopular(1);
  const movies = response.data.results;

  // React 컴포넌트를 html로 만들어줌
  // 일단 그럼 App 컴포넌트에 movies를 전달해서 데이터를 보여주는건 맞잖아
  // 어떻게 하는거지? 감이 안 잡히는데? renderToString으로 movie 컴포넌트를 가져오면 되려나?
  const renderedApp = renderToString(<App movies={movies} />);

  // 브라우저가 html받아서 실행할 때 window 객체에 초기 데이터를 넣음
  // 그럼 클라이언트에서는 이 데이터를 가지고 렌더링을 시키면 되는건가?
  // 이게 SSR이 맞나 그럼? 일단 이건 하이드레이션 용도인거같음 아무래도
  const renderedHTMLWithInitialData = template.replace(
    "<!--{INIT_DATA_AREA}-->",
    /*html*/ `
    <script>
      window.__INITIAL_DATA__ = {
        movies: ${JSON.stringify(movies)}
      }
    </script>
  `,
  );

  const renderedHTML = renderedHTMLWithInitialData.replace(
    "<!--{BODY_AREA}-->",
    renderedApp,
  );

  res.send(renderedHTML);
});

export default router;
