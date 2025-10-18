import dotenv from "dotenv";
dotenv.config();

import express, { type Request, type Response } from "express";
import path from "path";
import { moviesApi } from "./service/tmdbApi";

const metaTemplate = ({
  title,
  description,
  image,
  pageUrl,
  siteName,
}: {
  title: string;
  description: string;
  image: Record<string, string>;
  pageUrl: string;
  siteName: string;
}) => `
    <title>${title}</title>
    <meta charset="UTF-8" />
    <meta name='description' content='${description}' />
    <meta name='viewport' content='width=device-width, initial-scale=1' />
    <link rel='icon' href='/favicon.ico' />
    ${pageUrl && `<link rel='canonical' href='${pageUrl}' />`}

    <meta property='og:locale' content='ko_KR' />
    <meta property='og:site_name' content='${siteName}' />
    <meta property='og:type' content='website' />
    <meta property='og:title' content='${title}' />
    <meta property='og:description' content='${description}' />
    <meta property='og:url' content='${pageUrl}' />
    ${image.url && `<meta property='og:image' content='${image.url}' />`}
    ${image.alt && `<meta property='og:image:alt' content='${image.alt}' />`}

    <meta name='twitter:card' content='summary_large_image' />
    <meta name='twitter:title' content='${title}' />
    <meta name='twitter:description' content='${description}' />
    ${image.url && `<meta property='twitter:image' content='${image.url}' />`}
    ${
      image.alt &&
      `<meta property='twitter:image:alt' content='${image.alt}' />`
    }
`;

const app = express();
const PORT = 8080;

app.use(express.json());

app.get("/", async (_req: Request, res: Response) => {
  const popularMoviesResponse = await moviesApi.getPopular();
  const popularMovies = Array.isArray(popularMoviesResponse?.results)
    ? popularMoviesResponse.results
    : [];
  const bannerMoive = popularMovies[0];

  const metaTags = metaTemplate({
    title: "세오가 추천하는 인기 영화",
    description: "지금 인기 있는 영화 정보를 확인해보세요.",
    image: {
      url: bannerMoive.poster_path
        ? `https://image.tmdb.org/t/p/original${bannerMoive.poster_path}`
        : "/images/no_image.png",
      alt: bannerMoive.title,
    },
    pageUrl: "https://rendering-basecamp-production-4152.up.railway.app/",
    siteName: "세오가 추천하는 인기 영화",
  });

  const movieItemList = `
    <ul class="thumbnail-list">
    ${popularMovies
      .map(
        (movie) => `
      <li class="movie-item">
        <div class="item">
          <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face${movie.poster_path}" alt="${movie.title}" loading="lazy" />
          <div class="item-desc">
            <p class="rate">
              <img src="/images/star_empty.png" class="star" />
              <span>${movie.vote_average}</span>
            </p>
            <strong>${movie.title}</strong>
          </div>
        </div>
      </li>
    `
      )
      .join("")}
    </ul>
  `;

  res.send(/*html*/ `
    <!DOCTYPE html>
<html lang="ko">
  <head>
    ${metaTags}
    <link rel="stylesheet" href="/styles/index.css" />
  </head>
  <body>
    <div id="wrap">
      <header>
        <div class="background-container" style="background-image: url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${bannerMoive.poster_path});">
          <div class="overlay"></div>
          <div class="top-rated-container">
            <img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" />
            <div class="top-rated-movie">
              <div class="rate">
                <img src="/images/star_empty.png" width="32" height="32" />
                <span class="text-2xl font-semibold text-yellow">${bannerMoive.vote_average}</span>
              </div>
              <h1 class="text-3xl font-semibold">${bannerMoive.title}</h1>
              <button class="primary detail">자세히 보기</button>
            </div>
          </div>
        </div>
      </header>
      <main>
        <section class="container">
          <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
          ${movieItemList}
        </section>
      </main>
      <footer class="footer">
        <p>&copy; 우아한테크코스 All Rights Reserved.</p>
        <p><img src="/images/woowacourse_logo.png" width="180" alt="우아한테크코스" /></p>
      </footer>
    </div>
  </body>
</html>
        `);
});

app.get("/detail/:id", async (_req: Request, res: Response) => {
  const { id } = _req.params;
  const [popularMoviesResponse, popularMovieDetailResponse] = await Promise.all(
    [moviesApi.getPopular(), moviesApi.getDetail(Number(id))]
  );
  const popularMovies = Array.isArray(popularMoviesResponse?.results)
    ? popularMoviesResponse.results
    : [];
  const bannerMoive = popularMovies[0];

  const metaTags = metaTemplate({
    title: `세오 추천 영화 상세보기 | ${popularMovieDetailResponse.title}`,
    description: popularMovieDetailResponse.overview,
    image: {
      url: popularMovieDetailResponse.poster_path
        ? `https://image.tmdb.org/t/p/original${popularMovieDetailResponse.poster_path}`
        : "/images/no_image.png",
      alt: popularMovieDetailResponse.title,
    },
    pageUrl: `https://rendering-basecamp-production-4152.up.railway.app/detail/${id}`,
    siteName: "세오가 추천하는 인기 영화",
  });

  const movieItemList = `
    <ul class="thumbnail-list">
    ${popularMovies
      .map(
        (movie) => `
      <li class="movie-item">
        <div class="item">
          <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face${movie.poster_path}" alt="${movie.title}" loading="lazy" />
          <div class="item-desc">
            <p class="rate">
              <img src="/images/star_empty.png" class="star" />
              <span>${movie.vote_average}</span>
            </p>
            <strong>${movie.title}</strong>
          </div>
        </div>
      </li>
    `
      )
      .join("")}
    </ul>
  `;

  res.send(/*html*/ `
    <!DOCTYPE html>
<html lang="ko">
  <head>
    ${metaTags}
    <link rel="stylesheet" href="/styles/index.css" />
  </head>
  <body>
    <div id="wrap">
      <header>
        <div class="background-container" style="background-image: url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${
          bannerMoive.poster_path
        });">
          <div class="overlay"></div>
          <div class="top-rated-container">
            <img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" />
            <div class="top-rated-movie">
              <div class="rate">
                <img src="/images/star_empty.png" width="32" height="32" />
                <span class="text-2xl font-semibold text-yellow">${
                  bannerMoive.vote_average
                }</span>
              </div>
              <h1 class="text-3xl font-semibold">${bannerMoive.title}</h1>
              <button class="primary detail">자세히 보기</button>
            </div>
          </div>
        </div>
      </header>
      <main>
        <section class="container">
          <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
          ${movieItemList}
        </section>
      </main>
      <footer class="footer">
        <p>&copy; 우아한테크코스 All Rights Reserved.</p>
        <p><img src="/images/woowacourse_logo.png" width="180" alt="우아한테크코스" /></p>
      </footer>
    </div>

    <div class="modal-background active">
      <div class="modal">
        <!-- 모달 헤더 -->
        <div class="modal-header">
          <h1 class="modal-title">${popularMovieDetailResponse.title}</h1>
          <img src="/images/modal_button_close.png" width="24" height="24" class="modal-close-btn" alt="Close" />
        </div>

        <div class="modal-container">
          <img src="https://image.tmdb.org/t/p/original${
            popularMovieDetailResponse.poster_path
          }" alt="인사이드 아웃 2" class="modal-image" />
          <div class="modal-description">
            <!-- 영화 정보 섹션 -->
            <div class="movie-info-line">
              <span class="movie-meta">${popularMovieDetailResponse.genres
                .map((genre) => genre.name)
                .join(", ")}</span>
              <div class="movie-rating">
                <img src="/images/star_filled.png" width="16" height="16" />
                <span class="rating-value">${
                  popularMovieDetailResponse.vote_average
                }</span>
              </div>
            </div>

            <!-- 줄거리 -->
            <div class="overview-section">
              <p class="overview-text">${
                popularMovieDetailResponse.overview
              }</p>
            </div>

            <!-- 내 별점 섹션 -->
            <div class="my-rating-section">
              <div class="rating-header">
                <span class="rating-label">내 별점</span>
                <div class="star-rating">
                  <img src="/images/star_filled.png" width="24" height="24" alt="Star 1" />
                  <img src="/images/star_filled.png" width="24" height="24" alt="Star 2" />
                  <img src="/images/star_filled.png" width="24" height="24" alt="Star 3" />
                  <img src="/images/star_filled.png" width="24" height="24" alt="Star 4" />
                  <img src="/images/star_empty.png" width="24" height="24" alt="Star 5" />
                  <span class="rating-text">${Math.round(
                    popularMovieDetailResponse.vote_average
                  )} 재미있어요</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
        `);
});
// public 폴더 속 정적 파일을 웹에서 접근할 수 있도록 만든다.
app.use(express.static(path.join(__dirname, "../public")));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
