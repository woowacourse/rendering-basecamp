import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import path from "path";

import fs from "fs";
import { moviesApi } from "./service/tmdbApi";
import { Movie } from "./service/types";

const app = express();
const PORT = 8080;

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

  const movieListHtml = movies.map((movie: Movie) => `
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
  `).join("");

  return templateHtml
    .replace("<!--${HEADER_PLACEHOLDER}-->", headerHtml)
    .replace("<!--${MOVIE_LIST_PLACEHOLDER}-->", movieListHtml)
    .replace("<!--${OG_TAGS_PLACEHOLDER}-->", ogTagsHtml)
    .replace("<!--${MODAL_AREA_PLACEHOLDER}-->", modalHtml);
}

app.get("/", async (_req: Request, res: Response) => {
  try {
    const finalHtml = await renderHomePageHtml();
    res.send(finalHtml);
  } catch (error) {
    console.error("Failed to render home page:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/detail/:id", async (req: Request, res: Response) => {
  try {
    const movieId = Number(req.params.id);
    const movieDetail = await moviesApi.getDetail(movieId);
    
    const ogTagsHtml = `
      <title>${movieDetail.title} - 영화 리뷰</title>
      <meta property="og:title" content="${movieDetail.title}" />
      <meta property="og:description" content="${movieDetail.overview || `${movieDetail.title} 상세 정보`}" />
      <meta property="og:image" content="https://image.tmdb.org/t/p/w500${movieDetail.poster_path}" />
    `;

    const releaseYear = movieDetail.release_date.split("-")[0];
    const genres = movieDetail.genres.map(g => g.name).join(", ");
    
    const modalHtml = `
      <div class="modal-background active" id="modalBackground">
        <div class="modal">
          <a href="/">
            <button class="close-modal" id="closeModal">
              <img src="/images/modal_button_close.png" />
            </button>
          </a>
          <div class="modal-container">
            <div class="modal-image">
              <img src="https://image.tmdb.org/t/p/w500${movieDetail.poster_path}" />
            </div>
            <div class="modal-description">
              <h2>${movieDetail.title}</h2>
              <p class="category">${releaseYear} · ${genres}</p>
              <p class="rate">
                <img src="/images/star_empty.png" class="star" />
                <span>${movieDetail.vote_average.toFixed(1)}</span>
              </p>
              <hr />
              <p class="detail">${movieDetail.overview}</p>
            </div>
          </div>
        </div>
      </div>
    `;

    const finalHtml = await renderHomePageHtml(ogTagsHtml, modalHtml);
    res.send(finalHtml);
  } catch (error) {
    console.error("Failed to render detail page:", error);
    res.status(500).send("Internal Server Error");
  }
});

// public 폴더 속 정적 파일을 웹에서 접근할 수 있도록 만든다.
app.use(express.static(path.join(__dirname, "../public")));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
