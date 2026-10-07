import type { Movie, MovieDetailResponse } from './types';

const renderHeader = (featuredMovie: Movie) => {
  const backdropImageUrl = featuredMovie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${featuredMovie.backdrop_path}`
    : '/images/no_image.png';

  return /*html*/ `
    <header>
      <div
        class="background-container"
        style="background-image: url(${backdropImageUrl});"
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
                alt=""
              />
              <span class="text-2xl font-semibold text-yellow">
                ${featuredMovie.vote_average.toFixed(1)}
              </span>
            </div>
            <h1 class="text-3xl font-semibold">${featuredMovie.title}</h1>
            <form action="/detail/${featuredMovie.id}" method="get">
              <button class="primary detail" type="submit">자세히 보기</button>
            </form>
          </div>
        </div>
      </div>
    </header>
  `;
};

const renderMain = (movies: Movie[]) => {
  const movieItems = movies
    .map((movie) => {
      const posterImageUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : '/images/no_image.png';

      return /*html*/ `
          <li class="movie-item" data-index="${movie.id}">
            <a class="item" href="/detail/${movie.id}">
              <img
                class="thumbnail"
                src="${posterImageUrl}"
                alt="${movie.title}"
                loading="lazy"
              />
              <div class="item-desc">
                <p class="rate">
                  <img src="/images/star_empty.png" class="star" alt="" />
                  <span>${movie.vote_average.toFixed(1)}</span>
                </p>
                <strong>${movie.title}</strong>
              </div>
            </a>
          </li>
        `;
    })
    .join('');

  return /*html*/ `
    <main>
      <section class="container">
        <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
        <ul class="thumbnail-list">
          ${movieItems}
        </ul>
      </section>
    </main>
  `;
};

const renderFooter = () => /*html*/ `
  <footer class="footer">
    <p>&copy; 우아한테크코스 All Rights Reserved.</p>
    <p>
      <img
        src="/images/woowacourse_logo.png"
        width="180"
        alt="우아한테크코스"
      />
    </p>
  </footer>
`;

export const renderHome = (movies: Movie[], modal = '') => /*html*/ `
    <!doctype html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/styles/index.css" />
        <title>영화 리뷰</title>
      </head>
      <body>
        <div id="wrap">
          ${renderHeader(movies[0])}
          ${renderMain(movies)}
          ${renderFooter()}
        </div>
        ${modal}
      </body>
    </html>
`;

export const renderModal = (movie: MovieDetailResponse) => {
  const posterImageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
    : '/images/no_image.png';
  const genreNames = movie.genres.map(({ name }) => name).join(', ');

  return /*html*/ `
    <div class="modal-background active">
      <div
        class="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="movie-detail-title"
      >
        <!-- 모달 헤더 -->
        <div class="modal-header">
          <h1 id="movie-detail-title" class="modal-title">${movie.title}</h1>
          <a href="/" class="modal-close-btn" aria-label="모달 닫기">
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
            src="${posterImageUrl}"
            alt="${movie.title}"
            class="modal-image"
          />
          <div class="modal-description">
            <!-- 영화 정보 섹션 -->
            <div class="movie-info-line">
              <span class="movie-meta">${genreNames || '장르 정보 없음'}</span>
              <div class="movie-rating">
                <img
                  src="/images/star_filled.png"
                  width="16"
                  height="16"
                  alt="평점"
                />
                <span class="rating-value">${movie.vote_average.toFixed(1)}</span>
              </div>
            </div>

            <!-- 줄거리 -->
            <div class="overview-section">
              <p class="overview-text">
                ${movie.overview || '줄거리 정보가 없습니다.'}
              </p>
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
                  <span class="rating-text">8 재미있어요</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
  `;
};
