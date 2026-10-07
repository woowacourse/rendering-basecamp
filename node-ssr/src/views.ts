import type { Movie, MovieDetailResponse } from "./service/types";

// JSX에서는 React가 자동으로 처리하던 HTML 특수문자 변환
const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const getPosterUrl = (posterPath: string | null) => {
  if (posterPath === null) {
    return "/images/no_image.png";
  }

  return `https://image.tmdb.org/t/p/w500${posterPath}`;
};

const renderMovieItems = (movies: Movie[]) =>
  movies
    .map((movie) => {
      const posterUrl = getPosterUrl(movie.poster_path);
      const title = escapeHtml(movie.title);

      return `
      <li class="movie-item">
        <a class="item" href="/detail/${movie.id}">
          <img
            class="thumbnail"
            src="${posterUrl}"
            alt="${title}"
            loading="lazy"
          />
          <div class="item-desc">
            <p class="rate">
              <img
                src="/images/star_empty.png"
                class="star"
                alt=""
              />
              <span>${movie.vote_average.toFixed(1)}</span>
            </p>
            <strong>${title}</strong>
          </div>
        </a>
      </li>
    `;
    })
    .join("");

export const renderMovieDetailModal = (movie: MovieDetailResponse) => {
  const title = escapeHtml(movie.title);
  const genreNames = escapeHtml(
    movie.genres.map((genre) => genre.name).join(", "),
  );
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
    : "/images/no_image.png";
  const overview = escapeHtml(movie.overview || "줄거리 정보가 없습니다.");

  return /* html */ `
    <div class="modal-background active">
      <div class="modal">
        <div class="modal-header">
          <h1 class="modal-title">${title}</h1>

          <a href="/">
            <img
              src="/images/modal_button_close.png"
              width="24"
              height="24"
              class="modal-close-btn"
              alt="닫기"
            />
          </a>
        </div>

        <div class="modal-container">
          <img
            src="${posterUrl}"
            alt="${title}"
            class="modal-image"
          />

          <div class="modal-description">
            <div class="movie-info-line">
              <span class="movie-meta">${genreNames}</span>

              <div class="movie-rating">
                <img
                  src="/images/star_filled.png"
                  width="16"
                  height="16"
                  alt=""
                />
                <span class="rating-value">
                  ${movie.vote_average.toFixed(1)}
                </span>
              </div>
            </div>

            <div class="overview-section">
              <p class="overview-text">${overview}</p>
            </div>

            <div class="my-rating-section">
              <div class="rating-header">
                <span class="rating-label">내 별점</span>

                <div class="star-rating">
                  ${Array.from(
                    { length: 5 },
                    (_, index) => `
                      <img
                        src="/images/star_empty.png"
                        width="24"
                        height="24"
                        alt="Star ${index + 1}"
                      />
                    `,
                  ).join("")}

                  <span class="rating-text">
                    별점을 남겨주세요
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

export const renderMovieMetadata = (
  movie: MovieDetailResponse,
  origin: string,
  pageUrl: string,
) => {
  const title = escapeHtml(movie.title);
  const description = escapeHtml(movie.overview || `${movie.title} 상세 정보`);
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : `${origin}/images/no_image.png`;

  return /* html */ `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:url" content="${escapeHtml(pageUrl)}" />
    <meta property="og:type" content="website" />
  `;
};

export const renderHomePage = (
  movies: Movie[],
  modalHtml = "",
  metadataHtml = "",
) => {
  const featuredMovie = movies[0];
  const featuredMovieTitle = escapeHtml(featuredMovie.title);
  const backdropUrl = featuredMovie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${featuredMovie.backdrop_path}`
    : "/images/no_image.png";
  const movieItems = renderMovieItems(movies);

  return /* html */ `
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${metadataHtml || "<title>영화 리뷰</title>"}
    <link rel="stylesheet" href="/styles/reset.css" />
    <link rel="stylesheet" href="/styles/colors.css" />
    <link rel="stylesheet" href="/styles/text.css" />
    <link rel="stylesheet" href="/styles/main.css" />
    <link rel="stylesheet" href="/styles/thumbnail.css" />
    <link rel="stylesheet" href="/styles/modal.css" />
    <link rel="stylesheet" href="/styles/animation.css" />
    <link rel="stylesheet" href="/styles/media.css" />
  </head>
  <body>
    <div id="wrap">
      <header>
        <div class="background-container" style="background-image: url('${backdropUrl}')">
          <div class="overlay"></div>
          <div class="top-rated-container">
            <img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" />
            <div class="top-rated-movie">
              <div class="rate">
                <img src="/images/star_empty.png" width="32" height="32" />
                <span class="text-2xl font-semibold text-yellow">${featuredMovie.vote_average.toFixed(1)}</span>
              </div>
              <h1 class="text-3xl font-semibold">${featuredMovieTitle}</h1>
              <a class="primary detail" href="/detail/${featuredMovie.id}">자세히 보기</a>
            </div>
          </div>
        </div>
      </header>
      <main>
        <section class="container">
          <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
          <ul class="thumbnail-list">
            ${movieItems}
          </ul>
        </section>
      </main>
      <footer class="footer">
        <p>&copy; 우아한테크코스 All Rights Reserved.</p>
        <p><img src="/images/woowacourse_logo.png" width="180" alt="우아한테크코스" /></p>
      </footer>
    </div>
    ${modalHtml}
  </body>
</html>
  `;
};
