import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { moviesApi } from "./service/tmdbApi";

const app = express();
const PORT = 8080;

app.use(express.json());

app.get("/", async (_req: Request, res: Response) => {
  try {
    const data = await moviesApi.getPopular();
    const movies = data.results.slice(0, 12);
    const topMovie = movies[0];

    const templatePath = path.join(__dirname, "../public/index.html");
    let html = fs.readFileSync(templatePath, "utf-8");

    const headerHTML = `
      <header>
        <div class="background-container"
             style="background-image: url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/${
               topMovie.backdrop_path
             });">
          <div class="overlay"></div>
          <div class="top-rated-container">
            <img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" />
            <div class="top-rated-movie">
              <div class="rate">
                <img src="/images/star_empty.png" width="32" height="32" />
                <span class="text-2xl font-semibold text-yellow">
                  ${topMovie.vote_average.toFixed(1)}
                </span>
              </div>
              <h1 class="text-3xl font-semibold">${topMovie.title}</h1>
              <a href="/detail/${topMovie.id}">
                <button class="primary detail">자세히 보기</button>
              </a>
            </div>
          </div>
        </div>
      </header>
    `;

    html = html.replace(/<header>[\s\S]*<\/header>/, headerHTML);

    const movieListHTML = movies
      .map(
        (m) => `
        <li class="movie-item">
          <div class="item">
          <a href="/detail/${m.id}">
            <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/${
              m.poster_path
            }" alt="${m.title}" loading="lazy" />
            <div class="item-desc">
              <p class="rate">
                <img src="/images/star_empty.png" class="star" />
                <span>${m.vote_average.toFixed(1)}</span>
              </p>
              <strong>${m.title}</strong>
            </div>
            </a>
          </div>
        </li>
      `
      )
      .join("");

    html = html.replace(
      /<ul class="thumbnail-list">[\s\S]*<\/ul>/,
      `<ul class="thumbnail-list">${movieListHTML}</ul>`
    );

    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send("서버 오류");
  }
});

// public 폴더 속 정적 파일을 웹에서 접근할 수 있도록 만든다.
app.use(express.static(path.join(__dirname, "../public")));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
