import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import path from "path";

// TMDB API 설정
const TMDB_API_BASE = "https://api.themoviedb.org/3";
const TMDB_REQUEST_HEADERS = {
  Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
  "Content-Type": "application/json;charset=utf-8",
};

// 영화 타입 정의
interface MovieData {
  id: number;
  title: string;
  vote_average: number;
  poster_path: string | null;
  backdrop_path: string | null;
  overview?: string;
  genres?: Array<{ id: number; name: string }>;
}

// TMDB API 호출 - 인기 영화 목록
async function fetchPopularMovies(): Promise<MovieData[]> {
  const response = await fetch(
    `${TMDB_API_BASE}/movie/popular?language=ko-KR&page=1`,
    { headers: TMDB_REQUEST_HEADERS }
  );

  if (!response.ok) {
    throw new Error("인기 영화 데이터를 가져오는데 실패했습니다");
  }

  const data = (await response.json()) as { results: MovieData[] };
  return data.results;
}

// TMDB API 호출 - 영화 상세 정보
async function fetchMovieDetail(movieId: number): Promise<MovieData> {
  const response = await fetch(
    `${TMDB_API_BASE}/movie/${movieId}?language=ko-KR`,
    { headers: TMDB_REQUEST_HEADERS }
  );

  if (!response.ok) {
    throw new Error("영화 상세 정보를 가져오는데 실패했습니다");
  }

  return (await response.json()) as MovieData;
}

// HTML 이스케이프 함수
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

// 이미지 URL 생성 헬퍼
const imageUrlHelper = {
  thumbnail: (path: string | null) =>
    path
      ? `https://media.themoviedb.org/t/p/w440_and_h660_face${path}`
      : "/images/no_poster.png",
  fullPoster: (path: string | null) =>
    path
      ? `https://image.tmdb.org/t/p/original${path}`
      : "/images/no_poster.png",
  banner: (path: string | null) =>
    path
      ? `https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${path}`
      : "/images/cover_fallback.jpg",
};

// 요청 origin 추출
function extractOriginFromRequest(req: Request): string {
  const protocol = req.headers["x-forwarded-proto"] || req.protocol || "http";
  const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost:8080";
  return `${protocol}://${host}`;
}

const app = express();
const PORT = 8080;

app.use(express.json());

app.get("/", async (_req: Request, res: Response) => {
  try {
    const movies = await fetchPopularMovies();

    if (!movies || movies.length === 0) {
      return res.status(500).send("영화 데이터를 불러올 수 없습니다.");
    }

    // 첫 번째 영화를 배너로 사용
    const featuredMovie = movies[0];
    const bannerImageUrl = imageUrlHelper.banner(featuredMovie.backdrop_path);

    // 영화 목록 HTML 생성
    const movieListHtml = movies
      .map((movie) => {
        const thumbnailUrl = imageUrlHelper.thumbnail(movie.poster_path);
        const movieTitle = escapeHtml(movie.title);
        const rating = movie.vote_average.toFixed(1);

        return `
          <li class="movie-item">
            <a href="/detail/${movie.id}" class="item-link" style="text-decoration:none;color:inherit">
              <div class="item">
                <img class="thumbnail" src="${thumbnailUrl}" alt="${movieTitle}" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>${rating}</span>
                  </p>
                  <strong>${movieTitle}</strong>
                </div>
              </div>
            </a>
          </li>
        `;
      })
      .join("");

    const pageHtml = `<!DOCTYPE html>
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
        <div class="background-container" style="background-image: url(${bannerImageUrl});">
          <div class="overlay"></div>
          <div class="top-rated-container">
            <img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" />
            <div class="top-rated-movie">
              <div class="rate">
                <img src="/images/star_empty.png" width="32" height="32" />
                <span class="text-2xl font-semibold text-yellow">${featuredMovie.vote_average.toFixed(
                  1
                )}</span>
              </div>
              <h1 class="text-3xl font-semibold">${escapeHtml(
                featuredMovie.title
              )}</h1>
              <a href="/detail/${
                featuredMovie.id
              }"><button class="primary detail">자세히 보기</button></a>
            </div>
          </div>
        </div>
      </header>
      <main>
        <section class="container">
          <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
          <ul class="thumbnail-list">
            ${movieListHtml}
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

    return res.status(200).send(pageHtml);
  } catch (error) {
    console.error("메인 페이지 렌더링 에러:", error);
    return res.status(500).send("서버 오류가 발생했습니다.");
  }
});

app.get("/detail/:id", async (req: Request, res: Response) => {
  try {
    const movieId = parseInt(req.params.id, 10);

    if (isNaN(movieId) || movieId <= 0) {
      return res.status(400).send("유효하지 않은 영화 ID입니다.");
    }

    const movie = await fetchMovieDetail(movieId);
    const bannerUrl = imageUrlHelper.banner(movie.backdrop_path);
    const posterUrl = imageUrlHelper.fullPoster(movie.poster_path);

    const rating = movie.vote_average?.toFixed(1) ?? "0.0";
    const genreText = (movie.genres || []).map((g) => g.name).join(", ");
    const synopsis = movie.overview?.trim() || "줄거리 정보가 없습니다.";

    // OG 메타 태그용 데이터
    const currentOrigin = extractOriginFromRequest(req);
    const canonicalUrl = `${currentOrigin}/detail/${movie.id}`;
    const pageTitle = `${movie.title} | 영화 리뷰`;
    const pageDescription =
      synopsis.length > 100 ? synopsis.slice(0, 100) + "..." : synopsis;

    const detailPageHtml = `<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(pageTitle)}</title>
    <meta name="description" content="${escapeHtml(pageDescription)}" />

    <!-- Open Graph 메타 태그 -->
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(pageTitle)}" />
    <meta property="og:description" content="${escapeHtml(pageDescription)}" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="${posterUrl}" />

    <!-- Twitter 카드 메타 태그 -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(pageDescription)}" />
    <meta name="twitter:image" content="${posterUrl}" />

    <link rel="canonical" href="${canonicalUrl}" />
    <link rel="stylesheet" href="/styles/index.css" />
  </head>
  <body>
    <div id="wrap">
      <header>
        <div class="background-container" style="background-image: url(${bannerUrl});">
          <div class="overlay"></div>
          <div class="top-rated-container">
            <img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" />
            <div class="top-rated-movie">
              <div class="rate">
                <img src="/images/star_empty.png" width="32" height="32" />
                <span class="text-2xl font-semibold text-yellow">${rating}</span>
              </div>
              <h1 class="text-3xl font-semibold">${escapeHtml(movie.title)}</h1>
              <a href="/"><button class="primary detail">목록으로</button></a>
            </div>
          </div>
        </div>
      </header>
      <main>
        <section class="container">
          <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
          <ul class="thumbnail-list"></ul>
        </section>
      </main>
      <footer class="footer">
        <p>&copy; 우아한테크코스 All Rights Reserved.</p>
        <p><img src="/images/woowacourse_logo.png" width="180" alt="우아한테크코스" /></p>
      </footer>
    </div>

    <!-- 영화 상세 모달 -->
    <div class="modal-background active">
      <div class="modal">
        <div class="modal-header">
          <h1 class="modal-title">${escapeHtml(movie.title)}</h1>
          <img src="/images/modal_button_close.png" width="24" height="24" class="modal-close-btn" alt="Close" />
        </div>
        <div class="modal-container">
          <img src="${posterUrl}" alt="${escapeHtml(movie.title)}" class="modal-image" />
          <div class="modal-description">
            <div class="movie-info-line">
              <span class="movie-meta">${escapeHtml(genreText)}</span>
              <div class="movie-rating">
                <img src="/images/star_filled.png" width="16" height="16" />
                <span class="rating-value">${rating}</span>
              </div>
            </div>
            <div class="overview-section">
              <p class="overview-text">${escapeHtml(synopsis)}</p>
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

    return res.status(200).send(detailPageHtml);
  } catch (error) {
    console.error("영화 상세 페이지 렌더링 에러:", error);
    return res.status(500).send("서버 오류가 발생했습니다.");
  }
});

// public 폴더 속 정적 파일을 웹에서 접근할 수 있도록 만든다.
app.use(express.static(path.join(__dirname, "../public")));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
