import { Movie, MovieDetail } from "./service/types";

const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p";
const NO_IMAGE = "/images/no_image.png";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const posterUrl = (path: string | null, size: string) =>
  path ? `${TMDB_IMAGE_URL}/${size}${path}` : NO_IMAGE;

const renderHeader = (movie?: Movie) => {
  if (!movie) {
    return /*html*/ `
      <header>
        <div class="background-container">
          <div class="overlay"></div>
          <div class="top-rated-container">
            <img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" />
          </div>
        </div>
      </header>
    `;
  }

  const title = escapeHtml(movie.title);

  return /*html*/ `
    <header>
      <div class="background-container" style="background-image: url(${TMDB_IMAGE_URL}/w1920_and_h800_multi_faces${movie.poster_path});">
        <div class="overlay"></div>
        <div class="top-rated-container">
          <img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" />
          <div class="top-rated-movie">
            <div class="rate">
              <img src="/images/star_empty.png" width="32" height="32" />
              <span class="text-2xl font-semibold text-yellow">${movie.vote_average.toFixed(1)}</span>
            </div>
            <h1 class="text-3xl font-semibold">${title}</h1>
            <a href="/detail/${movie.id}"><button class="primary detail">자세히 보기</button></a>
          </div>
        </div>
      </div>
    </header>
  `;
};

const renderMovieItem = (movie: Movie) => {
  const title = escapeHtml(movie.title);

  return /*html*/ `
    <li class="movie-item">
      <a href="/detail/${movie.id}">
        <div class="item">
          <img class="thumbnail" src="${posterUrl(movie.poster_path, "w500")}" alt="${title}" loading="lazy" />
          <div class="item-desc">
            <p class="rate">
              <img src="/images/star_empty.png" class="star" />
              <span>${movie.vote_average.toFixed(1)}</span>
            </p>
            <strong>${title}</strong>
          </div>
        </div>
      </a>
    </li>
  `;
};

const renderMovieList = (movies: Movie[]) => /*html*/ `
  <main>
    <section class="container">
      <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
      <ul class="thumbnail-list">
        ${movies.map(renderMovieItem).join("")}
      </ul>
    </section>
  </main>
`;

const renderModal = (movie: MovieDetail) => {
  const title = escapeHtml(movie.title);
  const genres = escapeHtml(movie.genres.map((genre) => genre.name).join(", "));
  const overview = escapeHtml(movie.overview || "줄거리 정보가 없습니다.");
  const emptyStars = Array.from(
    { length: 5 },
    (_, index) =>
      `<img src="/images/star_empty.png" width="24" height="24" alt="Star ${index + 1}" />`
  ).join("");

  return /*html*/ `
    <div class="modal-background active">
      <div class="modal">
        <div class="modal-header">
          <h1 class="modal-title">${title}</h1>
          <a href="/"><img src="/images/modal_button_close.png" width="24" height="24" class="modal-close-btn" alt="Close" /></a>
        </div>
        <div class="modal-container">
          <img src="${posterUrl(movie.poster_path, "original")}" alt="${title}" class="modal-image" />
          <div class="modal-description">
            <div class="movie-info-line">
              <span class="movie-meta">${genres}</span>
              <div class="movie-rating">
                <img src="/images/star_filled.png" width="16" height="16" />
                <span class="rating-value">${movie.vote_average.toFixed(1)}</span>
              </div>
            </div>
            <div class="overview-section">
              <p class="overview-text">${overview}</p>
            </div>
            <div class="my-rating-section">
              <div class="rating-header">
                <span class="rating-label">내 별점</span>
                <div class="star-rating">
                  ${emptyStars}
                  <span class="rating-text">0 별점을 남겨주세요</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

const renderOgTags = (movie: MovieDetail) => {
  const title = escapeHtml(movie.title);
  const description = escapeHtml(movie.overview || "줄거리 정보가 없습니다.");

  return /*html*/ `
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${posterUrl(movie.poster_path, "w500")}" />
    <meta name="description" content="${description}" />
  `;
};

const renderDocument = ({
  title,
  head = "",
  body,
}: {
  title: string;
  head?: string;
  body: string;
}) => /*html*/ `
  <!DOCTYPE html>
  <html lang="ko">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="stylesheet" href="/styles/bundle.css" />
      <title>${title}</title>
      ${head}
    </head>
    <body>
      ${body}
    </body>
  </html>
`;

const renderLayout = (movies: Movie[]) => /*html*/ `
  <div id="wrap">
    ${renderHeader(movies[0])}
    ${renderMovieList(movies)}
    <footer class="footer">
      <p>&copy; 우아한테크코스 All Rights Reserved.</p>
      <p><img src="/images/woowacourse_logo.png" width="180" alt="우아한테크코스" /></p>
    </footer>
  </div>
`;

export const renderHomePage = (movies: Movie[]) =>
  renderDocument({
    title: "영화 리뷰",
    body: renderLayout(movies),
  });

export const renderDetailPage = (movies: Movie[], movie: MovieDetail) =>
  renderDocument({
    title: `${escapeHtml(movie.title)} | 영화 리뷰`,
    head: renderOgTags(movie),
    body: renderLayout(movies) + renderModal(movie),
  });
