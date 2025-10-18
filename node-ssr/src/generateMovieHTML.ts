import { Movie, MovieDetailResponse } from "./service/types";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const HERO_IMAGE_URL = "https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/";

const movieListHTML = ({ title, poster_path, vote_average }: Movie) => `
  <li class="movie-item">
    <div class="item">
      <img
        class="thumbnail"
        src="${
          poster_path ? IMAGE_BASE_URL + poster_path : "/images/no-poster.png"
        }"
        alt="${title}"
        loading="lazy"
      />
      <div class="item-desc">
        <p class="rate">
          <img src="/images/star_empty.png" class="star" />
          <span>${vote_average.toFixed(1)}</span>
        </p>
        <strong>${title}</strong>
      </div>
    </div>
  </li>
`;

const popularMoviesHTML = ({ title, poster_path, vote_average }: Movie) => `
  <header>
    <div
      class="background-container"
      style="
        background-image: url(${
          poster_path ? HERO_IMAGE_URL + poster_path : "/images/no-poster.png"
        });
        
      "
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
            <img src="/images/star_empty.png" width="32" height="32" />
            <span class="text-2xl font-semibold text-yellow">${vote_average}</span>
          </div>
          <h1 class="text-3xl font-semibold">${title}</h1>
          <button class="primary detail">자세히 보기</button>
        </div>
      </div>
    </div>
  </header>
`;

const movieDetailHTML = ({
  title,
  poster_path,
  vote_average,
  overview,
  genres,
}: MovieDetailResponse) => `

  <div class="modal-background active">
    <div class="modal">
      <!-- 모달 헤더 -->
      <div class="modal-header">
        <h1 class="modal-title">${title}</h1>
        <img src="/images/modal_button_close.png" width="24" height="24" class="modal-close-btn" alt="Close" />
      </div>

      <div class="modal-container">
        <img src="${
          poster_path ? IMAGE_BASE_URL + poster_path : "/images/no-poster.png"
        }" alt="${title}" class="modal-image" />
        <div class="modal-description">
          <!-- 영화 정보 섹션 -->
          <div class="movie-info-line">
            <span class="movie-meta">${genres
              .map((genre) => genre.name)
              .join(", ")}</span>
            <div class="movie-rating">
              <img src="/images/star_filled.png" width="16" height="16" />
              <span class="rating-value">${vote_average.toFixed(1)}</span>
            </div>
          </div>

          <!-- 줄거리 -->
          <div class="overview-section">
            <p class="overview-text">
              ${overview}
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

const generateMovieHTML = (movies: Movie[]) => {
  return movies.map(movieListHTML).join("");
};

const generatePopularMovieHTML = (movie: Movie) => {
  return popularMoviesHTML(movie);
};

const generateMovieDetailHTML = (movieDetailResponse: MovieDetailResponse) => {
  return movieDetailHTML(movieDetailResponse);
};
const genrerateMovieMeta = (movieDetailResponse?: MovieDetailResponse) => {
  if (!movieDetailResponse) {
    return `
     <title>마빈의 영화 리뷰</title>
    `;
  }
  return `
    <title>${movieDetailResponse.title}</title>
    <meta property="og:title" content="${
      "마빈의 영화 리뷰 | " + movieDetailResponse.title
    }" />
    <meta
      property="og:description"
      content="${movieDetailResponse.overview}"
    />
    <meta
      property="og:image"
      content="${
        movieDetailResponse.poster_path
          ? IMAGE_BASE_URL + movieDetailResponse.poster_path
          : "/images/no-poster.png"
      }"
    />
  `;
};
export const generateHTML = (
  movies: Movie[],
  movieDetailResponse?: MovieDetailResponse
) => {
  const moviesHTML = generateMovieHTML(movies);
  const popularMoviesHTML = generatePopularMovieHTML(movies[0]);
  const movieDetailHTML = movieDetailResponse
    ? generateMovieDetailHTML(movieDetailResponse)
    : "";
  const movieMeta = genrerateMovieMeta(movieDetailResponse);
  return `<!DOCTYPE html>
<html lang="ko">
  <head>
     <meta charset="UTF-8" />
     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
     <link rel="stylesheet" href="/styles/index.css" />
    ${movieMeta}
  </head>
  <body>
    <div id="wrap">
      ${popularMoviesHTML}
      <main>
        <section class="container">
          <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
          <ul class="thumbnail-list" id="movie-list">
            ${moviesHTML}
          </ul>
        </section>
      </main>
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
    </div>
    ${movieDetailHTML}
  </body>
</html>
`;
};
