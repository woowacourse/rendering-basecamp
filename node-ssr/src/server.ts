import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import path from "path";
import { moviesApi } from "./service/tmdbApi";
import { Movie, MovieDetail, MovieResponse } from "./service/types";

const app = express();
const PORT = 8080;

app.use(express.json());

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

app.get("/", async (req: Request, res: Response) => {
  try {
    const popular: MovieResponse = await moviesApi.getPopular(1);
    const featured: Movie | undefined = popular.results?.[0];

    const heroBackground = featured?.backdrop_path
      ? `https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${featured.backdrop_path}`
      : "/images/no_image.png";
    const heroRating = (featured?.vote_average ?? 0).toFixed(1);
    const heroTitle = featured?.title ?? "영화";

    const toPosterUrl = (posterPath: string | null) =>
      posterPath
        ? `https://media.themoviedb.org/t/p/w440_and_h660_face${posterPath}`
        : "/images/no_image.png";

    const movieItemsHtml = (popular.results || [])
      .slice(0, 20)
      .map((movie) => {
        const poster = toPosterUrl(movie.poster_path);
        const rating = (movie.vote_average ?? 0).toFixed(1);
        const title = movie.title ?? "제목 없음";
        return `
            <li class="movie-item">
              <a class="item" href="/detail/${movie.id}">
                <img class="thumbnail" src="${poster}" alt="${title}" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>${rating}</span>
                  </p>
                  <strong>${title}</strong>
                </div>
              </a>
            </li>`;
      })
      .join("");

    const forwarded = req.headers["x-forwarded-proto"]; // for proxies
    const protocol = Array.isArray(forwarded)
      ? forwarded[0]
      : forwarded || req.protocol;
    const host = req.headers.host || `localhost:${PORT}`;
    const canonicalUrl = `${protocol}://${host}${req.originalUrl}`;

    const html = /*html*/ `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/styles/index.css" />
        <title>영화 리뷰</title>
        <link rel="canonical" href="${canonicalUrl}" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="영화 리뷰" />
        <meta property="og:locale" content="ko_KR" />
        <meta property="og:url" content="${canonicalUrl}" />
        <meta property="og:title" content="영화 리뷰" />
        <meta property="og:description" content="영화 리뷰 서비스" />
        <meta property="og:image" content="${heroBackground}" />
        <meta property="og:image:alt" content="영화 리뷰 포스터" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="영화 리뷰" />
        <meta name="twitter:description" content="영화 리뷰 서비스" />
        <meta name="twitter:image" content="${heroBackground}" />
      </head>
      <body>
        <div id="wrap">
          <header>
            <div class="background-container" style="background-image: url(${heroBackground});">
              <div class="overlay"></div>
              <div class="top-rated-container">
                <img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" />
                <div class="top-rated-movie">
                  <div class="rate">
                    <img src="/images/star_empty.png" width="32" height="32" />
                    <span class="text-2xl font-semibold text-yellow">${heroRating}</span>
                  </div>
                  <h1 class="text-3xl font-semibold">${heroTitle}</h1>
                  <button class="primary detail">자세히 보기</button>
                </div>
              </div>
            </div>
          </header>
          <main>
            <section class="container">
              <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
              <ul class="thumbnail-list">
                ${movieItemsHtml}
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

    res.status(200).send(html);
  } catch (error) {
    console.error("/ SSR 렌더링 실패", error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html lang="ko">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>오류</title>
        </head>
        <body>
          <h1>서버 오류</h1>
          <p>인기 영화 정보를 불러오는 데 실패했습니다.</p>
        </body>
      </html>
    `);
  }
});

app.get("/detail/:id", async (req: Request, res: Response) => {
  try {
    const popular: MovieResponse = await moviesApi.getPopular(1);
    const featured: Movie | undefined = popular.results?.[0];

    const heroBackground = featured?.backdrop_path
      ? `https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${featured.backdrop_path}`
      : "/images/no_image.png";
    const heroRating = (featured?.vote_average ?? 0).toFixed(1);
    const heroTitle = featured?.title ?? "영화";

    const toPosterUrl = (posterPath: string | null) =>
      posterPath
        ? `https://media.themoviedb.org/t/p/w440_and_h660_face${posterPath}`
        : "/images/no_image.png";

    const movieItemsHtml = (popular.results || [])
      .slice(0, 20)
      .map((movie) => {
        const poster = toPosterUrl(movie.poster_path);
        const rating = (movie.vote_average ?? 0).toFixed(1);
        const title = movie.title ?? "제목 없음";
        return `
            <li class="movie-item">
              <a class="item" href="/detail/${movie.id}">
                <img class="thumbnail" src="${poster}" alt="${title}" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>${rating}</span>
                  </p>
                  <strong>${title}</strong>
                </div>
              </a>
            </li>`;
      })
      .join("");

    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).send("잘못된 요청입니다.");
      return;
    }

    const detail: MovieDetail = await moviesApi.getDetail(id);

    const poster = detail.poster_path
      ? `https://image.tmdb.org/t/p/original/${detail.poster_path}`
      : "/images/no_image.png";

    const title = detail.title ?? "제목 없음";
    const rating = (detail.vote_average ?? 0).toFixed(1);
    const genres = (detail.genres || []).map((g) => g.name).join(", ");
    const overview = detail.overview || "줄거리 정보가 없습니다.";

    const forwarded = req.headers["x-forwarded-proto"]; // for proxies
    const protocol = Array.isArray(forwarded)
      ? forwarded[0]
      : forwarded || req.protocol;
    const host = req.headers.host || `localhost:${PORT}`;
    const canonicalUrl = `${protocol}://${host}${req.originalUrl}`;

    const html = /*html*/ `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/styles/index.css" />
        <title>${escapeHtml(title)} - 상세</title>
        <link rel="canonical" href="${canonicalUrl}" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="영화 리뷰" />
        <meta property="og:locale" content="ko_KR" />
        <meta property="og:url" content="${canonicalUrl}" />
        <meta property="og:title" content="${escapeHtml(title)}" />
        <meta property="og:description" content="${escapeHtml(overview)}" />
        <meta property="og:image" content="${poster}" />
        <meta property="og:image:alt" content="${escapeHtml(title)} 포스터" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${escapeHtml(title)}" />
        <meta name="twitter:description" content="${escapeHtml(overview)}" />
        <meta name="twitter:image" content="${poster}" />
      </head>
      <body>
        <div id="wrap">
          <header>
            <div class="background-container" style="background-image: url(${heroBackground});">
              <div class="overlay"></div>
              <div class="top-rated-container">
                <img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" />
                <div class="top-rated-movie">
                  <div class="rate">
                    <img src="/images/star_empty.png" width="32" height="32" />
                    <span class="text-2xl font-semibold text-yellow">${heroRating}</span>
                  </div>
                  <h1 class="text-3xl font-semibold">${heroTitle}</h1>
                  <button class="primary detail">자세히 보기</button>
                </div>
              </div>
            </div>
          </header>
          <main>
          <section class="container">
          <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
          <ul class="thumbnail-list">
            ${movieItemsHtml}
          </ul>
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
              <h1 class="modal-title">${title}</h1>
              <img src="/images/modal_button_close.png" width="24" height="24" class="modal-close-btn" alt="Close" />
            </div>
            <div class="modal-container">
              <img src="${poster}" alt="${title}" class="modal-image" />
              <div class="modal-description">
                <div class="movie-info-line">
                  <span class="movie-meta">${genres}</span>
                  <div class="movie-rating">
                    <img src="/images/star_filled.png" width="16" height="16" />
                    <span class="rating-value">${rating}</span>
                  </div>
                </div>
                <div class="overview-section">
                  <p class="overview-text">${overview}</p>
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
                      <span class="rating-text">${rating} 재미있어요</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>`;

    res.status(200).send(html);
  } catch (error) {
    console.error("/detail SSR 렌더링 실패", error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html lang="ko">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>오류</title>
        </head>
        <body>
          <h1>서버 오류</h1>
          <p>영화 상세 정보를 불러오는 데 실패했습니다.</p>
        </body>
      </html>
    `);
  }
});

// public 폴더 속 정적 파일을 웹에서 접근할 수 있도록 만든다.
app.use(express.static(path.join(__dirname, "../public")));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
