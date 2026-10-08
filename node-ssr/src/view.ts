import { Movie, MovieDetail } from "./service/types";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

function escapeHtml(value: string | number): string {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function imageUrl(imagePath: string | null, size: string): string {
  return imagePath && /^\/[a-zA-Z0-9._/-]+$/.test(imagePath)
    ? `${IMAGE_BASE_URL}/${size}${imagePath}`
    : "/images/no_image.png";
}

function rating(value: number): string {
  return Number.isFinite(value) ? value.toFixed(1) : "0.0";
}

function movieList(movies: Movie[]): string {
  return movies
    .map(
      (movie) => `
        <li class="movie-item">
          <a class="item" href="/detail/${movie.id}">
            <img class="thumbnail" src="${imageUrl(movie.poster_path, "w500")}" alt="${escapeHtml(movie.title)}" loading="lazy" />
            <div class="item-desc">
              <p class="rate">
                <img src="/images/star_empty.png" class="star" alt="" />
                <span>${rating(movie.vote_average)}</span>
              </p>
              <strong>${escapeHtml(movie.title)}</strong>
            </div>
          </a>
        </li>`
    )
    .join("");
}

function detailModal(movie: MovieDetail): string {
  const title = escapeHtml(movie.title);
  const genres = movie.genres.map((genre) => escapeHtml(genre.name)).join(", ");

  return `
    <div class="modal-background active">
      <div class="modal" role="dialog" aria-modal="true" aria-label="${title}">
        <div class="modal-header">
          <h2 class="modal-title">${title}</h2>
          <a href="/" class="modal-close-btn" aria-label="닫기">
            <img src="/images/modal_button_close.png" width="24" height="24" alt="" />
          </a>
        </div>
        <div class="modal-container">
          <img src="${imageUrl(movie.poster_path, "original")}" alt="${title}" class="modal-image" />
          <div class="modal-description">
            <div class="movie-info-line">
              <span class="movie-meta">${genres}</span>
              <div class="movie-rating">
                <img src="/images/star_filled.png" width="16" height="16" alt="" />
                <span class="rating-value">${rating(movie.vote_average)}</span>
              </div>
            </div>
            <div class="overview-section">
              <p class="overview-text">${escapeHtml(movie.overview || "줄거리 정보가 없습니다.")}</p>
            </div>
            <div class="my-rating-section">
              <div class="rating-header">
                <span class="rating-label">내 별점</span>
                <div class="star-rating">
                  ${Array.from({ length: 5 }, (_, index) => `<img src="/images/star_empty.png" width="24" height="24" alt="Star ${index + 1}" />`).join("")}
                  <span class="rating-text">별점을 남겨주세요</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
}

function page(movies: Movie[], movie?: MovieDetail): string {
  const featured = movies[0];
  const title = movie ? `${movie.title} | 영화 리뷰` : "영화 리뷰";
  const description = movie?.overview || "지금 인기 있는 영화를 확인해 보세요.";
  const poster = movie && imageUrl(movie.poster_path, "w500");
  const ogImage = poster && poster.startsWith("https://") ? `<meta property="og:image" content="${escapeHtml(poster)}" />` : "";

  return `<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/styles/index.css" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    ${ogImage}
  </head>
  <body>
    <div id="wrap">
      <header>
        <div class="background-container" style="background-image: url('${featured ? imageUrl(featured.backdrop_path || featured.poster_path, "w1280") : "/images/no_image.png"}');">
          <div class="overlay"></div>
          <div class="top-rated-container">
            <a href="/" aria-label="홈으로"><img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" /></a>
            ${featured ? `
            <div class="top-rated-movie">
              <div class="rate">
                <img src="/images/star_empty.png" width="32" height="32" alt="" />
                <span class="text-2xl font-semibold text-yellow">${rating(featured.vote_average)}</span>
              </div>
              <h1 class="text-3xl font-semibold">${escapeHtml(featured.title)}</h1>
              <a class="primary detail" href="/detail/${featured.id}">자세히 보기</a>
            </div>` : ""}
          </div>
        </div>
      </header>
      <main>
        <section class="container">
          <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
          <ul class="thumbnail-list">${movieList(movies)}</ul>
        </section>
      </main>
      <footer class="footer">
        <p>&copy; 우아한테크코스 All Rights Reserved.</p>
        <p><img src="/images/woowacourse_logo.png" width="180" alt="우아한테크코스" /></p>
      </footer>
    </div>
    ${movie ? detailModal(movie) : ""}
  </body>
</html>`;
}

export function renderHomePage(movies: Movie[]): string {
  return page(movies);
}

export function renderDetailPage(movies: Movie[], movie: MovieDetail): string {
  return page(movies, movie);
}
