import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import path from "path";

const app = express();
const PORT = 8080;

const renderHome = () => /* html */ `
  <div id="wrap">
    <header>
      <div
        class="background-container"
        style="background-image: url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/stKGOm8UyhuLPR9sZLjs5AkmncA.jpg)"
      >
        <div class="overlay"></div>
        <div class="top-rated-container">
          <img
            src="/images/logo.png"
            width="117"
            height="20"
            class="logo"
            alt="MovieLogo"
          />
          <div class="top-rated-movie">
            <div class="rate">
              <img
                src="/images/star_empty.png"
                width="32"
                height="32"
                alt=""
              />
              <span class="text-2xl font-semibold text-yellow">7.7</span>
            </div>
            <h1 class="text-3xl font-semibold">인사이드 아웃 2</h1>
            <button class="primary detail">자세히 보기</button>
          </div>
        </div>
      </div>
    </header>

    <main>
      <section class="container">
        <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
        <ul class="thumbnail-list">
          <li class="movie-item">
            <div class="item">
              <img
                class="thumbnail"
                src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg"
                alt="인사이드 아웃 2"
                loading="lazy"
              />
              <div class="item-desc">
                <p class="rate">
                  <img src="/images/star_empty.png" class="star" alt="" />
                  <span>7.7</span>
                </p>
                <strong>인사이드 아웃 2</strong>
              </div>
            </div>
          </li>
        </ul>
      </section>
    </main>

    <footer class="footer">
      <p>&copy; 우아한테크코스 All Rights Reserved.</p>
      <p>
        <img
          src="/images/woowacourse_logo.png"
          width="180"
          alt="우아한테크코스"
        />
      </p>
    </footer>
  </div>
`;

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  const html = /* html */ `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/styles/index.css" />
        <title>영화 리뷰</title>
      </head>
      <body>
        ${renderHome()}
      </body>
    </html>
  `;

  res.send(html);
});

// public 폴더 속 정적 파일을 웹에서 접근할 수 있도록 만든다.
app.use(express.static(path.join(__dirname, "../public")));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
