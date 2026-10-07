import type { MovieDetailResponse, MovieResponse } from "./service/types";

const TMDB_IMAGE = {
  backdrop: "https://image.tmdb.org/t/p/w1920_and_h800_multi_faces",
  thumbnail: "https://media.themoviedb.org/t/p/w440_and_h660_face",
  original: "https://image.tmdb.org/t/p/original",
};

const MAX_STARS = 5;

const SITE_URL = process.env.SITE_URL ?? "http://localhost:3000";

const DEFAULT_OG = {
  title: "영화 리뷰",
  description: "지금 인기 있는 영화를 확인하고 별점을 남겨보세요.",
  image: "https://image.tmdb.org/t/p/w1280/stKGOm8UyhuLPR9sZLjs5AkmncA.jpg",
  url: SITE_URL,
};

const escapeHtml = (text: string) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export function renderOgTags(movieDetail?: MovieDetailResponse) {
  const og = movieDetail
    ? {
        title: movieDetail.title,
        description: movieDetail.overview || DEFAULT_OG.description,
        image: `${TMDB_IMAGE.original}${movieDetail.poster_path}`,
        url: `${SITE_URL}/detail/${movieDetail.id}`,
      }
    : DEFAULT_OG;

  return `
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="영화 리뷰" />
    <meta property="og:title" content="${escapeHtml(og.title)}" />
    <meta property="og:description" content="${escapeHtml(og.description)}" />
    <meta property="og:image" content="${og.image}" />
    <meta property="og:url" content="${og.url}" />`;
}

const formatRate = (rate: number) => rate.toFixed(1);

type PopularMovie = MovieResponse["results"][number];

function renderBanner(movie: PopularMovie) {
  return `
      <header>
        <div class="background-container" style="background-image: url(${TMDB_IMAGE.backdrop}${movie.backdrop_path});">
          <div class="overlay"></div>
          <div class="top-rated-container">
            <img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" />
            <div class="top-rated-movie">
              <div class="rate">
                <img src="/images/star_empty.png" width="32" height="32" />
                <span class="text-2xl font-semibold text-yellow">${formatRate(movie.vote_average)}</span>
              </div>
              <h1 class="text-3xl font-semibold">${escapeHtml(movie.title)}</h1>
              <button class="primary detail">자세히 보기</button>
            </div>
          </div>
        </div>
      </header>`;
}

function renderMovieItem(movie: PopularMovie) {
  return `
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="${TMDB_IMAGE.thumbnail}${movie.poster_path}" alt="${escapeHtml(movie.title)}" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>${formatRate(movie.vote_average)}</span>
                  </p>
                  <strong>${escapeHtml(movie.title)}</strong>
                </div>
              </div>
            </li>`;
}

export function renderPopular(popularMovies: MovieResponse) {
  const movies = popularMovies.results;

  return `
      ${renderBanner(movies[0])}
      <main>
        <section class="container">
          <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
          <ul class="thumbnail-list">
            ${movies.map(renderMovieItem).join("")}
          </ul>
        </section>
      </main>`;
}

function renderMyRating() {
  const stars = Array.from(
    { length: MAX_STARS },
    (_, index) => `
                  <img src="/images/star_empty.png" width="24" height="24" alt="Star ${index + 1}" />`,
  ).join("");

  return `
            <div class="my-rating-section">
              <div class="rating-header">
                <span class="rating-label">내 별점</span>
                <div class="star-rating">
                  ${stars}
                  <span class="rating-text">별점을 남겨주세요</span>
                </div>
              </div>
            </div>`;
}

export function renderModal(movieDetail: MovieDetailResponse) {
  const title = escapeHtml(movieDetail.title);
  const genres = escapeHtml(
    movieDetail.genres.map((genre) => genre.name).join(", "),
  );
  const overview = escapeHtml(
    movieDetail.overview || "줄거리 정보가 없습니다.",
  );

  return `
    <div class="modal-background active">
      <div class="modal">
        <div class="modal-header">
          <h1 class="modal-title">${title}</h1>
          <a href="/">
            <img src="/images/modal_button_close.png" width="24" height="24" class="modal-close-btn" alt="Close" />
          </a>
        </div>

        <div class="modal-container">
          <img src="${TMDB_IMAGE.original}${movieDetail.poster_path}" alt="${title}" class="modal-image" />
          <div class="modal-description">
            <div class="movie-info-line">
              <span class="movie-meta">${genres}</span>
              <div class="movie-rating">
                <img src="/images/star_filled.png" width="16" height="16" />
                <span class="rating-value">${formatRate(movieDetail.vote_average)}</span>
              </div>
            </div>

            <div class="overview-section">
              <p class="overview-text">${overview}</p>
            </div>
            ${renderMyRating()}
          </div>
        </div>
      </div>
    </div>`;
}

export function renderPage(
  popularMovies: MovieResponse,
  movieDetail?: MovieDetailResponse,
) {
  return `
  <!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/styles/bundle.css" />
    <title>영화 리뷰</title>
    ${renderOgTags(movieDetail)}
  </head>
  <body>
    <div id="wrap">
      ${renderPopular(popularMovies)}
      <footer class="footer">
        <p>&copy; 우아한테크코스 All Rights Reserved.</p>
        <p><img src="/images/woowacourse_logo.png" width="180" alt="우아한테크코스" /></p>
      </footer>
    </div>
    ${movieDetail ? renderModal(movieDetail) : ""}
  </body>
</html>
  `;
}
