import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import path from "path";

import fs from "fs";
import { moviesApi } from "./service/tmdbApi";
import { Movie, MovieDetailResponse } from "./service/types";
import axios from "axios";

const app = express();
const PORT = Number(process.env.PORT) || 8080;

app.use(express.json());

const templatePath = path.join(__dirname, "../public/index.html");
const templateHtml = fs.readFileSync(templatePath, "utf-8");

async function renderHomePageHtml(ogTagsHtml = "", modalHtml = "") {
  const popularMoviesData = await moviesApi.getPopular();
  const movies = popularMoviesData.results;

  const featuredMovie = movies[0];
  const headerHtml = `
    <div class="background-container" style="background-image: url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${featuredMovie.backdrop_path});">
        <div class="overlay"></div>
        <div class="top-rated-container">
          <img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" />
          <div class="top-rated-movie">
            <div class="rate">
              <img src="/images/star_empty.png" width="32" height="32" />
              <span class="text-2xl font-semibold text-yellow">${featuredMovie.vote_average.toFixed(1)}</span>
            </div>
            <h1 class="text-3xl font-semibold">${featuredMovie.title}</h1>
            <button class="primary detail">자세히 보기</button>
          </div>
        </div>
      </div>
  `;
  const movieListHtml = movies
    .map(
      (movie: Movie) => `
    <li class="movie-item">
            <a href="/detail/${movie.id}">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face${movie.poster_path}" alt="${movie.title}" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>${movie.vote_average.toFixed(1)}</span>
                  </p>
                  <strong>${movie.title}</strong>
                </div>
              </div>
            </a>
          </li>
  `,
    )
    .join("");

  return templateHtml
    .replace("<!--${HEADER_PLACEHOLDER}-->", headerHtml)
    .replace("<!--${MOVIE_LIST_PLACEHOLDER}-->", movieListHtml)
    .replace("<!--${OG_TAGS_PLACEHOLDER}-->", ogTagsHtml)
    .replace("<!--${MODAL_AREA_PLACEHOLDER}-->", modalHtml);
}

function renderMovieModalHtml(movie: MovieDetailResponse) {
  const genreNames = movie.genres.map((genre) => genre.name).join(",");

  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
    : "/images/no_image.png";

  return `
    <div class="modal-background active">
      <div class="modal">
        <div class="modal-header">
          <h1 class="modal-title">${movie.title}</h1>
          <img
            src="/images/modal_button_close.png"
            width="24"
            height="24"
            class="modal-close-btn"
            alt="닫기"
          />
        </div>

        <div class="modal-container">
          <img
            src="${imageUrl}"
            alt="${movie.title}"
            class="modal-image"
          />

          <div class="modal-description">
            <div class="movie-info-line">
              <span class="movie-meta">${genreNames}</span>

              <div class="movie-rating">
                <img src="/images/star_filled.png" width="16" height="16" />
                <span class="rating-value">
                  ${movie.vote_average.toFixed(1)}
                </span>
              </div>
            </div>

            <div class="overview-section">
              <p class="overview-text">
                ${movie.overview || "줄거리 정보가 없습니다."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;
}

app.get("/", async (_req: Request, res: Response) => {
  try {
    const html = await renderHomePageHtml();

    res.type("html").send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send("영화 정보를 불러오지 못했습니다.");
  }
});

app.get("/detail/:id", async (req: Request, res: Response) => {
  const movieId = Number(req.params.id);

  if (!Number.isSafeInteger(movieId) || movieId <= 0) {
    res.status(404).send("잘못된 영화 ID입니다.");
    return;
  }

  try {
    const movie = await moviesApi.getDetail(movieId);

    const imagePath = movie.backdrop_path ?? movie.poster_path;
    const ogImage = imagePath ? `https://image.tmdb.org/t/p/w1280${imagePath}` : "";

    const ogTagsHtml = `
      <meta property="og:type" content="website" />
      <meta property="og:title" content="${movie.title}" />
      <meta property="og:description" content="${movie.overview}" />
      ${ogImage ? `<meta property="og:image" content="${ogImage}" />` : ""}
    `;

    const modalHtml = renderMovieModalHtml(movie);

    const html = await renderHomePageHtml(ogTagsHtml, modalHtml);

    res.type("html").send(html);
  } catch (error) {
    console.error(error);

    if (axios.isAxiosError(error) && error.response?.status === 404) {
      res.status(404).send("영화를 찾을 수 없습니다.");
      return;
    }

    res.status(500).send("영화 정보를 불러오지 못했습니다.");
  }
});
// public 폴더 속 정적 파일을 웹에서 접근할 수 있도록 만든다.
app.use(express.static(path.join(__dirname, "../public")));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
