import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import path from "path";

const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_HEADERS: Record<string, string> = {
  Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN ?? ""}`,
  "Content-Type": "application/json;charset=utf-8",
};

type Movie = {
  id: number;
  title: string;
  vote_average: number;
  poster_path: string | null;
  backdrop_path: string | null;
  overview?: string;
  genres?: { id: number; name: string }[];
};

async function getPopular(): Promise<Movie[]> {
  const res = await fetch(`${TMDB_BASE}/movie/popular?language=ko-KR&page=1`, {
    headers: TMDB_HEADERS,
  });
  if (!res.ok) throw new Error("TMDB popular fetch failed");
  const json = (await res.json()) as { results: Movie[] };
  return json.results;
}

async function getDetail(id: number): Promise<Movie> {
  const res = await fetch(`${TMDB_BASE}/movie/${id}?language=ko-KR`, {
    headers: TMDB_HEADERS,
  });
  if (!res.ok) throw new Error("TMDB detail fetch failed");
  return (await res.json()) as Movie;
}

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const img = {
  posterThumb: (p?: string | null) =>
    p
      ? `https://media.themoviedb.org/t/p/w440_and_h660_face${p}`
      : "/images/no_poster.png",
  posterOriginal: (p?: string | null) =>
    p ? `https://image.tmdb.org/t/p/original${p}` : "/images/no_poster.png",
  backdrop: (p?: string | null) =>
    p
      ? `https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${p}`
      : "/images/cover_fallback.jpg",
};

const app = express();
const PORT = 8080;

app.use(express.json());

app.get("/", async (_req: Request, res: Response) => {
  try {
    const movies = await getPopular();
    if (!movies.length) throw new Error("No popular movies");

    const featured = movies[0];
    const banner = img.backdrop(featured.backdrop_path);

    const listHTML = movies
      .map(
        (m) => `
<li class="movie-item">
  <a href="/detail/${
    m.id
  }" class="item-link" style="text-decoration:none;color:inherit">
    <div class="item">
      <img class="thumbnail" src="${img.posterThumb(m.poster_path)}" alt="${esc(
          m.title
        )}" loading="lazy" />
      <div class="item-desc">
        <p class="rate">
          <img src="/images/star_empty.png" class="star" />
          <span>${m.vote_average.toFixed(1)}</span>
        </p>
        <strong>${esc(m.title)}</strong>
      </div>
    </div>
  </a>
</li>`
      )
      .join("");

    const html = `<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/styles/index.css" />
    <title>영화 리뷰</title>
  </head>
  <body>
    <div id="wrap">
      <header>
        <div class="background-container" style="background-image: url(${banner});">
          <div class="overlay"></div>
          <div class="top-rated-container">
            <img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" />
            <div class="top-rated-movie">
              <div class="rate">
                <img src="/images/star_empty.png" width="32" height="32" />
                <span class="text-2xl font-semibold text-yellow">${featured.vote_average.toFixed(
                  1
                )}</span>
              </div>
              <h1 class="text-3xl font-semibold">${esc(featured.title)}</h1>
              <a href="/detail/${
                featured.id
              }"><button class="primary detail">자세히 보기</button></a>
            </div>
          </div>
        </div>
      </header>
      <main>
        <section class="container">
          <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
          <ul class="thumbnail-list">
            ${listHTML}
          </ul>
        </section>
      </main>
      <footer class="footer">
        <p>&copy; 우아한테크코스 All Rights Reserved.</p>
        <p><img src="/images/woowacourse_logo.png" width="180" alt="우아한테크코스" /></p>
      </footer>
    </div>
  </body>
</html>`;

    return res.status(200).send(html);
  } catch (e) {
    console.error(e);
    return res.status(500).send("서버 오류가 발생했습니다.");
  }
});

app.get("/detail/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id) || id <= 0) {
      return res.status(400).send("잘못된 요청입니다.");
    }

    const movie = await getDetail(id);
    const banner = img.backdrop(movie.backdrop_path);
    const poster = img.posterOriginal(movie.poster_path);
    const rating = movie.vote_average?.toFixed(1) ?? "0.0";
    const genres = (movie.genres ?? []).map((g) => g.name).join(", ");
    const overview = movie.overview?.trim() || "줄거리 정보가 없습니다.";

    const html = `<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/styles/index.css" />
    <title>영화 리뷰</title>
  </head>
  <body>
    <div id="wrap">
      <header>
        <div class="background-container" style="background-image: url(${banner});">
          <div class="overlay"></div>
          <div class="top-rated-container">
            <img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" />
            <div class="top-rated-movie">
              <div class="rate">
                <img src="/images/star_empty.png" width="32" height="32" />
                <span class="text-2xl font-semibold text-yellow">${rating}</span>
              </div>
              <h1 class="text-3xl font-semibold">${esc(movie.title)}</h1>
              <a href="/"><button class="primary detail">자세히 보기</button></a>
            </div>
          </div>
        </div>
      </header>
      <main>
        <section class="container">
          <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
          <!-- 썸네일 목록은 모달 데모라 비움 -->
          <ul class="thumbnail-list"></ul>
        </section>
      </main>
      <footer class="footer">
        <p>&copy; 우아한테크코스 All Rights Reserved.</p>
        <p><img src="/images/woowacourse_logo.png" width="180" alt="우아한테크코스" /></p>
      </footer>
    </div>

    <div class="modal-background active">
      <div class="modal">
        <div class="modal-header">
          <h1 class="modal-title">${esc(movie.title)}</h1>
          <img src="/images/modal_button_close.png" width="24" height="24" class="modal-close-btn" alt="Close" />
        </div>

        <div class="modal-container">
          <img src="${poster}" alt="${esc(movie.title)}" class="modal-image" />
          <div class="modal-description">
            <div class="movie-info-line">
              <span class="movie-meta">${esc(genres)}</span>
              <div class="movie-rating">
                <img src="/images/star_filled.png" width="16" height="16" />
                <span class="rating-value">${rating}</span>
              </div>
            </div>

            <div class="overview-section">
              <p class="overview-text">${esc(overview)}</p>
            </div>

            <div class="my-rating-section">
              <div class="rating-header">
                <span class="rating-label">내 별점</span>
                <div class="star-rating">
                  <img src="/images/star_filled.png" width="24" height="24" alt="Star 1" />
                  <img src="/images/star_filled.png" width="24" height="24" alt="Star 2" />
                  <img src="/images/star_filled.png" width="24" height="24" alt="Star 3" />
                  <img src="/images/star_filled.png" width="24" height="24" alt="Star 4" />
                  <img src="/images/star_empty.png" width="24" height="24" alt="Star 5" />
                  <span class="rating-text">8 재미있어요</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>`;

    return res.status(200).send(html);
  } catch (e) {
    console.error(e);
    return res.status(500).send("서버 오류가 발생했습니다.");
  }
});

app.use(express.static(path.join(__dirname, "../public")));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
