import type { Movie, MovieDetail } from "./service/types";

// 제목에 <, & 같은 문자가 있어도 HTML 코드로 해석하지 않고 텍스트로 표시되도록 한다.
// 보안을 위한
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderPage(
  movies: Movie[],
  head: string,
  modal: string = "",
): string {
  const firstMovie = movies[0];

  const bannerPosterUrl = firstMovie?.poster_path
    ? `https://image.tmdb.org/t/p/w500${firstMovie.poster_path}`
    : "/images/no_image.png";

  const banner = firstMovie
    ? `
    <header>
      <div
        class="background-container"
        style="background-image: url('${escapeHtml(
          encodeURI(bannerPosterUrl),
        )}');"
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
                alt="평점"
              />
              <span class="text-2xl font-semibold text-yellow">
                ${firstMovie.vote_average.toFixed(1)}
              </span>
            </div>
            <h1 class="text-3xl font-semibold">
              ${escapeHtml(firstMovie.title)}
            </h1>
            <a class="primary detail" href="/detail/${firstMovie.id}">
              자세히 보기
            </a>
          </div>
        </div>
      </div>
    </header>
  `
    : "";

  const cards = movies
    .map((movie) => {
      const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "/images/no_image.png";

      return `
        <li class="movie-item">
          <a class="item" href="/detail/${movie.id}">
            <img
              class="thumbnail"
              src="${escapeHtml(posterUrl)}"
              alt="${escapeHtml(movie.title)}"
              loading="lazy"
            />
            <div class="item-desc">
              <p class="rate">
                <img
                  src="/images/star_empty.png"
                  class="star"
                  alt="평점"
                />
                <span>${movie.vote_average.toFixed(1)}</span>
              </p>
              <strong>${escapeHtml(movie.title)}</strong>
            </div>
          </a>
        </li>
      `;
    })
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/styles/index.css" />
        ${head}
      </head>
      <body>
        <div id="wrap">
          ${banner}
          <main>
            <section class="container">
              <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
              ${
                movies.length > 0
                  ? `<ul class="thumbnail-list">${cards}</ul>`
                  : "<p>인기 영화가 없습니다.</p>"
              }
            </section>
          </main>
        </div>
      ${modal}
      </body>
    </html>
  `;
}

export function renderHomePage(movies: Movie[]): string {
  return renderPage(movies, "<title>영화 리뷰</title>");
}

export function renderDetailPage(
  movies: Movie[],
  movie: MovieDetail,
  siteUrl: string,
): string {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/images/no_image.png";

  const genres = movie.genres.map((genre) => genre.name).join(", ");
  const overview = movie.overview.trim() || "줄거리 정보가 없습니다.";

  const stars = Array.from(
    { length: 5 },
    () => `<img src="/images/star_empty.png" width="24" heigth="24" alt=""/>`,
  ).join("");

  const modal = `
    <div class="modal-background active">
      <div
        class="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="movie-title"
      >
        <div class="modal-header">
          <h1 id="movie-title" class="modal-title">
            ${escapeHtml(movie.title)}
          </h1>
          <a href="/" class="modal-close-btn" aria-label="닫기">
            <img
              src="/images/modal_button_close.png"
              width="24"
              height="24"
              alt=""
            />
          </a>
        </div>

        <div class="modal-container">
          <img
            src="${escapeHtml(posterUrl)}"
            alt="${escapeHtml(movie.title)}"
            class="modal-image"
          />
          <div class="modal-description">
            <div class="movie-info-line">
              <span class="movie-meta">${escapeHtml(genres)}</span>
              <div class="movie-rating">
                <img
                  src="/images/star_filled.png"
                  width="16"
                  height="16"
                  alt="평점"
                />
                <span class="rating-value">
                  ${movie.vote_average.toFixed(1)}
                </span>
              </div>
            </div>

            <div class="overview-section">
              <p class="overview-text">${escapeHtml(overview)}</p>
            </div>

            <div class="my-rating-section">
              <div class="rating-header">
                <span class="rating-label">내 별점</span>
                <div class="star-rating">
                  ${stars}
                  <span class="rating-text">0 별점을 남겨주세요</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const pageUrl = new URL(`/detail/${movie.id}`, siteUrl).href;
  const imageUrl = new URL(posterUrl, siteUrl).href;

  const head = `
  <title>${escapeHtml(movie.title)} | 영화 리뷰</title>
  <meta name="description" content="${escapeHtml(overview)}" />

  <meta property="og:title" content="${escapeHtml(movie.title)}" />
  <meta property="og:description" content="${escapeHtml(overview)}" />
  <meta property="og:image" content="${escapeHtml(imageUrl)}" />
  <meta property="og:url" content="${escapeHtml(pageUrl)}" />
  <meta property="og:type" content="video.movie" />
`;

  return renderPage(movies, modal, head);
}
