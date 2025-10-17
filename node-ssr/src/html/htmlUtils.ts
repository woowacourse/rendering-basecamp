import { Movie, MovieDetail } from "../service/types";

// 이미지 URL 상수
export const TMDB_IMAGE_BASE_URL = {
  POSTER: "https://media.themoviedb.org/t/p/w440_and_h660_face",
  BACKDROP: "https://image.tmdb.org/t/p/w1920_and_h800_multi_faces",
  ORIGINAL: "https://image.tmdb.org/t/p/original",
} as const;

// 공통 메타 태그 생성
export const generateMetaTags = (options: {
  description: string;
  keywords: string;
  title: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
}) => /*html*/ `
  <!-- Basic Meta Tags -->
  <meta name="description" content="${options.description}" />
  <meta name="keywords" content="${options.keywords}" />
  <meta name="author" content="우아한테크코스" />
  <meta name="robots" content="index, follow" />
  <meta name="theme-color" content="#1a1a2e" />

  <!-- Open Graph Tags -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${options.ogTitle}" />
  <meta property="og:description" content="${options.ogDescription}" />
  <meta property="og:image" content="${options.ogImage}" />
  <meta property="og:url" content="${options.ogUrl}" />
  <meta property="og:site_name" content="영화 리뷰" />
  <meta property="og:locale" content="ko_KR" />

  <!-- Twitter Card Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${options.ogTitle}" />
  <meta name="twitter:description" content="${options.ogDescription}" />
  <meta name="twitter:image" content="${options.ogImage}" />
`;

// 헤더 생성 (배경 이미지와 탑 영화 정보)
export const generateHeader = (topMovie: Movie) => {
  const backdropUrl = topMovie.backdrop_path
    ? `${TMDB_IMAGE_BASE_URL.BACKDROP}${topMovie.backdrop_path}`
    : "";
  const rating = topMovie.vote_average.toFixed(1);

  return /*html*/ `
    <header>
      <div class="background-container" style="background-image: url(${backdropUrl});">
        <div class="overlay"></div>
        <div class="top-rated-container">
          <img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" />
          <div class="top-rated-movie">
            <div class="rate">
              <img src="/images/star_empty.png" width="32" height="32" />
              <span class="text-2xl font-semibold text-yellow">${rating}</span>
            </div>
            <h1 class="text-3xl font-semibold">${topMovie.title}</h1>
            <button class="primary detail">자세히 보기</button>
          </div>
        </div>
      </div>
    </header>
  `;
};

// 영화 아이템 생성
export const generateMovieItem = (movie: Movie) => {
  const posterUrl = movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL.POSTER}${movie.poster_path}`
    : "";
  const rating = movie.vote_average.toFixed(1);

  return /*html*/ `
    <li class="movie-item">
      <div class="item">
        <img class="thumbnail" src="${posterUrl}" alt="${movie.title}" loading="lazy" />
        <div class="item-desc">
          <p class="rate">
            <img src="/images/star_empty.png" class="star" />
            <span>${rating}</span>
          </p>
          <strong>${movie.title}</strong>
        </div>
      </div>
    </li>
  `;
};

// 영화 목록 생성
export const generateMovieList = (movies: Movie[]) => /*html*/ `
  <ul class="thumbnail-list">
    ${movies.map((movie) => generateMovieItem(movie)).join("")}
  </ul>
`;

// 푸터 생성
export const generateFooter = () => /*html*/ `
  <footer class="footer">
    <p>&copy; 우아한테크코스 All Rights Reserved.</p>
    <p><img src="/images/woowacourse_logo.png" width="180" alt="우아한테크코스" /></p>
  </footer>
`;

// 모달 생성 (상세 페이지용)
export const generateModal = (movie: MovieDetail) => {
  const posterUrl = movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL.ORIGINAL}${movie.poster_path}`
    : "";
  const rating = movie.vote_average.toFixed(1);
  const genres = movie.genres.map((g) => g.name).join(", ");

  return /*html*/ `
    <div class="modal-background active">
      <div class="modal">
        <!-- 모달 헤더 -->
        <div class="modal-header">
          <h1 class="modal-title">${movie.title}</h1>
          <img src="/images/modal_button_close.png" width="24" height="24" class="modal-close-btn" alt="Close" />
        </div>

        <div class="modal-container">
          <img src="${posterUrl}" alt="${movie.title}" class="modal-image" />
          <div class="modal-description">
            <!-- 영화 정보 섹션 -->
            <div class="movie-info-line">
              <span class="movie-meta">${genres}</span>
              <div class="movie-rating">
                <img src="/images/star_filled.png" width="16" height="16" />
                <span class="rating-value">${rating}</span>
              </div>
            </div>

            <!-- 줄거리 -->
            <div class="overview-section">
              <p class="overview-text">
                ${movie.overview}
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
