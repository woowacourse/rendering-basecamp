import type { MovieDetail } from '../service/types';

export function renderMovieDetailModalContent(movie: MovieDetail): string {
  return /*html*/ `
    <!-- 모달 헤더 -->
    <div class="modal-header">
      <h1 class="modal-title">${movie.title}</h1>
      <img
        class="modal-close-btn"
        alt="Close"
        src="/images/modal_button_close.png"
        width="24"
        height="24"
        onclick="window.closeMovieDetailModal();"
      />
    </div>

    <div class="modal-container">
      <img
        class="modal-image"
        width="280"
        height="420"
        alt="${movie.title}"
        src="${movie.poster_path ? `https://image.tmdb.org/t/p/original${movie.poster_path}` : '/images/no_image.png'}"
        onerror="this.onerror = null; this.src = '/images/no_image.png';"
      />
      <div class="modal-description">
        <!-- 영화 정보 섹션 -->
        <div class="movie-info-line">
          <span class="movie-meta">${movie.genres.map((genre) => genre.name).join(', ')}</span>
          <div class="movie-rating">
            <img src="/images/star_filled.png" width="16" height="16" />
            <span class="rating-value">${movie.vote_average}</span>
          </div>
        </div>

        <!-- 줄거리 -->
        <div class="overview-section">
          <p class="overview-text">
            ${movie.overview}
          </p>
        </div>

        <div class="my-rating-section">
          <div class="rating-header">
            <span class="rating-label">내 별점</span>
            <div class="star-rating" aria-busy="true">
              <div class="rating-skeleton" aria-label="내 별점을 불러오는 중입니다."></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
