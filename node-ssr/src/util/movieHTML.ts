import { MovieDetailResponse } from "../service/types";

type MovieItem = {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

export function movieHTML() {
  let _header = "";
  let _movieList = "";
  let _footer = "";

  const builder = {
    generate(data: MovieItem[]) {
      this._reset();
      _header = this.createHeader({
        backgroundImgSrc: `https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/${data[0].poster_path}`,
        logoSrc: "/images/logo.png",
        rating: data[0].vote_average,
        title: data[0].title,
      });
      _movieList = this.createMovieList(data);
      _footer = this.createFooter();
      return this;
    },
    generateWithDetail(data: MovieItem[], detail: MovieDetailResponse) {
      this.generate(data);
      this._detailModal = this.createMovieDetailModal(detail);
      this._metaTags = this.createMetaTags(detail);
      return this;
    },
    createMetaTags(detail: MovieDetailResponse) {
      const title = detail.title;
      const description = detail.overview;
      const url = ""; // 필요 시 도메인 포함 URL 지정
      const image = detail.backdrop_path
        ? `https://image.tmdb.org/t/p/original${detail.backdrop_path}`
        : "";
      const type = "video.movie";
      const movieDuration = detail.runtime ? detail.runtime.toString() : "";
      const movieReleaseDate = detail.release_date || "";
      const movieTags = detail.genres.map((g) => g.name).join(", ");

      return `
    <title>${title}</title>
    <meta name="description" content="${description}" />

    <meta property="og:type" content="${type}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    ${
      image
        ? `
      <meta property="og:image" content="${image}" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/jpeg" />`
        : ""
    }
    ${url ? `<meta property="og:url" content="${url}" />` : ""}
    <meta property="og:site_name" content="영화 추천 사이트" />

    <meta property="video:duration" content="${movieDuration}" />
    <meta property="video:release_date" content="${movieReleaseDate}" />
    <meta property="video:tag" content="${movieTags}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    ${image ? `<meta name="twitter:image" content="${image}" />` : ""}
  `;
    },
    createHeader({
      backgroundImgSrc,
      logoSrc,
      rating,
      title,
    }: {
      backgroundImgSrc: string;
      logoSrc: string;
      rating: number;
      title: string;
    }) {
      return `
        <header>
          <div class="background-container" style="background-image: url(${backgroundImgSrc});">
            <div class="overlay"></div>
            <div class="top-rated-container">
              <img src="${logoSrc}" width="117" height="20" class="logo" alt="MovieLogo" />
              <div class="top-rated-movie">
                <div class="rate">
                  <img src="/images/star_empty.png" width="32" height="32" />
                  <span class="text-2xl font-semibold text-yellow">${rating}</span>
                </div>
                <h1 class="text-3xl font-semibold">${title}</h1>
                <button class="primary detail">자세히 보기</button>
              </div>
            </div>
          </div>
        </header>
      `;
    },
    createMovieItem({
      id,
      thumbnailSrc,
      alt,
      rating,
      title,
    }: {
      id: number;
      thumbnailSrc: string;
      alt: string;
      rating: number;
      title: string;
    }) {
      return `
        <li class="movie-item" data-id="${id}">
          <div class="item">
            <img class="thumbnail" src="${thumbnailSrc}" alt="${alt}" loading="lazy" />
            <div class="item-desc">
              <p class="rate">
                <img src="/images/star_empty.png" class="star" />
                <span>${rating}</span>
              </p>
              <strong>${title}</strong>
            </div>
          </div>
        </li>
      `;
    },
    createMovieList(movies: MovieItem[]) {
      return `
        <section class="container">
          <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
          <ul id="movie-list" class="thumbnail-list">
            ${movies
              .map((movie) =>
                this.createMovieItem({
                  id: movie.id,
                  thumbnailSrc: movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "/images/no_image.png",
                  alt: movie.title,
                  rating: movie.vote_average,
                  title: movie.title,
                })
              )
              .join("")}
          </ul>
        </section>
      `;
    },
    createFooter() {
      return `
        <footer class="footer">
          <p>&copy; 우아한테크코스 All Rights Reserved.</p>
          <p><img src="/images/woowacourse_logo.png" width="180" alt="우아한테크코스" /></p>
        </footer>
      `;
    },
    createMovieDetailModal(detail: MovieDetailResponse) {
      return `
    <div class="modal-background active">
      <div class="modal">
        <!-- 모달 헤더 -->
        <div class="modal-header">
          <h1 class="modal-title">${detail.title}</h1>
          <img src="/images/modal_button_close.png" width="24" height="24" id="modal-close-btn" class="modal-close-btn" alt="Close" />
        </div>

        <div class="modal-container">
          <img src="${
            detail.backdrop_path
              ? "https://image.tmdb.org/t/p/original" + detail.backdrop_path
              : "/images/no_image.png"
          }" alt="${detail.title}" class="modal-image" />
          <div class="modal-description">
            <!-- 영화 정보 섹션 -->
            <div class="movie-info-line">
              <span class="movie-meta">${detail.genres
                .map((g) => g.name)
                .join(", ")}</span>
              <div class="movie-rating">
                <img src="/images/star_filled.png" width="16" height="16" />
                <span class="rating-value">${detail.vote_average.toFixed(
                  1
                )}</span>
              </div>
            </div>

            <!-- 줄거리 -->
            <div class="overview-section">
              <p class="overview-text">
                ${detail.overview}
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
                  <span class="rating-text">${detail.vote_average.toFixed(
                    1
                  )} 재미있어요</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  `;
    },
    build() {
      return `
        <!DOCTYPE html>
        <html lang="ko">
        <head>
          <meta charset="UTF-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          ${this._metaTags || ""}
          <link rel="stylesheet" href="/styles/index.css"/>
          <title>영화 리뷰</title>
          <script>
            document.addEventListener('DOMContentLoaded', () => {
                document.getElementById('movie-list').addEventListener('click', (e) => {
                    const li = e.target.closest('li.movie-item');
                    if (!li) return;
                    const movieId = li.dataset.id;
                    if (movieId) {
                    window.location.href = '/detail/' + movieId;
                    }
                });

                const closeBtn = document.getElementById('modal-close-btn');
                if (closeBtn) {
                    closeBtn.addEventListener('click', () => {
                    window.location.href = '/';
                    });
                }
            });
          </script>
        </head>
        <body>
          <div id="wrap">
            ${_header}
            <main>
              ${_movieList}
              ${this._detailModal || ""}
            </main>
            ${_footer}
          </div>
        </body>
        </html>
      `;
    },
    _reset() {
      _header = "";
      _movieList = "";
      _footer = "";
      this._detailModal = "";
      this._metaTags = "";
    },

    _detailModal: "",
    _metaTags: "",
  };

  return builder;
}
