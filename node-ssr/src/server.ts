import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import path from "path";
import { moviesApi } from "./service/tmdbApi";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

function generateMovieCard(movie: any) {
  return `
    <div class="movie-item" data-movie-id="${movie.id}">
      <img src="${
        movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : "/images/no_image.png"
      }" 
           alt="${movie.title}" 
           class="movie-poster">
      <div class="movie-info">
        <h3 class="movie-title">${movie.title}</h3>
        <div class="movie-rating">
          <span class="rating-value">${movie.vote_average.toFixed(1)}</span>
          <div class="stars">
            ${Array.from(
              { length: 5 },
              (_, i) =>
                `<img src="/images/star_${
                  i < Math.floor(movie.vote_average / 2) ? "filled" : "empty"
                }.png" 
                    alt="star" class="star">`
            ).join("")}
          </div>
        </div>
      </div>
    </div>
  `;
}

function generateHomePageHTML(movies: any[]) {
  const featuredMovie = movies[0];
  const movieCards = movies.map((movie) => generateMovieCard(movie)).join("");

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>영화 리뷰</title>
  <link rel="stylesheet" href="/styles/reset.css">
  <link rel="stylesheet" href="/styles/colors.css">
  <link rel="stylesheet" href="/styles/text.css">
  <link rel="stylesheet" href="/styles/main.css">
  <link rel="stylesheet" href="/styles/thumbnail.css">
  <link rel="stylesheet" href="/styles/media.css">
  <link rel="stylesheet" href="/styles/animation.css">
</head>
<body>
  <div class="app">
    <header class="header">
      <div class="header-content">
        <img src="/images/woowacourse_logo.png" alt="우아한테크코스" class="logo">
        <h1 class="title">영화 리뷰</h1>
      </div>
    </header>
    
    <main class="main">
      <section class="featured-movie">
        <div class="featured-content">
          <img src="${
            featuredMovie.backdrop_path
              ? `https://image.tmdb.org/t/p/w780${featuredMovie.backdrop_path}`
              : "/images/no_image.png"
          }" 
               alt="${featuredMovie.title}" 
               class="featured-backdrop">
          <div class="featured-info">
            <h2 class="featured-title">${featuredMovie.title}</h2>
            <p class="featured-overview">${featuredMovie.overview}</p>
            <div class="featured-rating">
              <span class="rating-value">${featuredMovie.vote_average.toFixed(
                1
              )}</span>
              <div class="stars">
                ${Array.from(
                  { length: 5 },
                  (_, i) =>
                    `<img src="/images/star_${
                      i < Math.floor(featuredMovie.vote_average / 2)
                        ? "filled"
                        : "empty"
                    }.png" 
                        alt="star" class="star">`
                ).join("")}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section class="movie-list">
        <h2 class="section-title">인기 영화</h2>
        <div class="movie-grid">
          ${movieCards}
        </div>
      </section>
    </main>
    
    <footer class="footer">
      <p>&copy; 2024 영화 리뷰. All rights reserved.</p>
    </footer>
  </div>
</body>
</html>`;
}

function generateDetailPageHTML(movie: any) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${movie.title} - 영화 리뷰</title>
  
  <!-- Open Graph 메타태그 -->
  <meta property="og:title" content="${movie.title} - 영화 리뷰">
  <meta property="og:description" content="${movie.overview}">
  <meta property="og:image" content="${
    movie.backdrop_path
      ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
      : "/images/no_image.png"
  }">
  <meta property="og:url" content="${
    process.env.BASE_URL || "http://localhost:8080"
  }/detail/${movie.id}">
  <meta property="og:type" content="movie">
  
  <!-- Twitter Card 메타태그 -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${movie.title} - 영화 리뷰">
  <meta name="twitter:description" content="${movie.overview}">
  <meta name="twitter:image" content="${
    movie.backdrop_path
      ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
      : "/images/no_image.png"
  }">
  
  <link rel="stylesheet" href="/styles/reset.css">
  <link rel="stylesheet" href="/styles/colors.css">
  <link rel="stylesheet" href="/styles/text.css">
  <link rel="stylesheet" href="/styles/main.css">
  <link rel="stylesheet" href="/styles/modal.css">
  <link rel="stylesheet" href="/styles/media.css">
  <link rel="stylesheet" href="/styles/animation.css">
</head>
<body>
  <div class="app">
    <header class="header">
      <div class="header-content">
        <img src="/images/woowacourse_logo.png" alt="우아한테크코스" class="logo">
        <h1 class="title">영화 리뷰</h1>
      </div>
    </header>
    
    <main class="main">
      <div class="movie-detail">
        <div class="detail-backdrop">
          <img src="${
            movie.backdrop_path
              ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
              : "/images/no_image.png"
          }" 
               alt="${movie.title}" 
               class="backdrop-image">
        </div>
        
        <div class="detail-content">
          <div class="detail-poster">
            <img src="${
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "/images/no_image.png"
            }" 
                 alt="${movie.title}" 
                 class="poster-image">
          </div>
          
          <div class="detail-info">
            <h1 class="detail-title">${movie.title}</h1>
            <div class="detail-meta">
              <span class="release-date">${movie.release_date}</span>
              <span class="runtime">${movie.runtime}분</span>
              <span class="rating">${movie.vote_average.toFixed(1)}/10</span>
            </div>
            <p class="detail-overview">${movie.overview}</p>
            <div class="detail-genres">
              ${movie.genres
                .map(
                  (genre: any) => `<span class="genre-tag">${genre.name}</span>`
                )
                .join("")}
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <footer class="footer">
      <p>&copy; 2024 영화 리뷰. All rights reserved.</p>
    </footer>
  </div>
</body>
</html>`;
}

app.get("/", async (_req: Request, res: Response) => {
  try {
    const response = await moviesApi.getPopular();
    const html = generateHomePageHTML(response.results);
    return res.send(html);
  } catch (error) {
    console.error("홈페이지 로딩 오류:", error);
    return res.status(500).send(`
      <!DOCTYPE html>
      <html lang="ko">
      <head>
        <title>오류 - 영화 리뷰</title>
      </head>
      <body>
        <h1>영화 데이터를 불러올 수 없습니다.</h1>
        <p>잠시 후 다시 시도해주세요.</p>
      </body>
      </html>
    `);
  }
});

app.get("/detail/:id", async (req: Request, res: Response) => {
  try {
    const movieId = req.params.id;
    const movie = await moviesApi.getDetail(parseInt(movieId));

    if (!movie) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html lang="ko">
        <head>
          <title>영화를 찾을 수 없습니다 - 영화 리뷰</title>
        </head>
        <body>
          <h1>영화를 찾을 수 없습니다.</h1>
          <p>요청하신 영화가 존재하지 않습니다.</p>
        </body>
        </html>
      `);
    }

    const html = generateDetailPageHTML(movie);
    return res.send(html);
  } catch (error) {
    console.error("영화 상세 페이지 로딩 오류:", error);
    return res.status(500).send(`
      <!DOCTYPE html>
      <html lang="ko">
      <head>
        <title>오류 - 영화 리뷰</title>
      </head>
      <body>
        <h1>영화 정보를 불러올 수 없습니다.</h1>
        <p>잠시 후 다시 시도해주세요.</p>
      </body>
      </html>
    `);
  }
});

app.use((_req: Request, res: Response) => {
  res.status(404).send(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <title>페이지를 찾을 수 없습니다 - 영화 리뷰</title>
    </head>
    <body>
      <h1>404 - 페이지를 찾을 수 없습니다</h1>
      <p>요청하신 페이지가 존재하지 않습니다.</p>
      <a href="/">홈으로 돌아가기</a>
    </body>
    </html>
  `);
});

app.use((error: Error, _req: Request, res: Response, _next: any) => {
  console.error("서버 오류:", error);
  res.status(500).send(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <title>서버 오류 - 영화 리뷰</title>
    </head>
    <body>
      <h1>500 - 서버 오류</h1>
      <p>서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.</p>
      <a href="/">홈으로 돌아가기</a>
    </body>
    </html>
  `);
});

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
  console.log(`📁 정적 파일 경로: ${path.join(__dirname, "../public")}`);
});

export default app;
