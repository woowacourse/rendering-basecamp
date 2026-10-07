import type { MovieDetail } from '../service/types';

export function renderMovieDetailModal(movie: MovieDetail): string {
  return /*html*/ `
    <div class="modal-background active">
      <div class="modal">
        <!-- 모달 헤더 -->
        <div class="modal-header">
          <h1 class="modal-title">${movie.title}</h1>
          <img src="/images/modal_button_close.png" width="24" height="24" class="modal-close-btn" alt="Close" />
        </div>
    
        <div class="modal-container">
          <img 
            class="modal-image" 
            alt="${movie.title}" 
            src="${
              movie.poster_path ? `https://image.tmdb.org/t/p/original${movie.poster_path}` : '/images/no_image.png'
            }" 
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
    
            <!-- TODO: 내 별점 섹션
            <div class="my-rating-section">
              <div class="rating-header">
                <span class="rating-label">내 별점</span>
                <div class="star-rating">
                  <img src="/images/star_filled.png" width="24" height="24" alt="Star 1" />
                  <img src="/images/star_filled.png" width="24" height="24" alt="Star 2" />
                  <img src="/images/star_filled.png" width="24" height="24" alt="Star 3" />
                  <img src="/images/star_filled.png" width="24" height="24" alt="Star 4" />
                  <img src="/images/star_empty.png" width="24" height="24" alt="Star 5" />
                  <span class="rating-text"></span>
                </div>
              </div>
            </div>
            -->
          </div>
        </div>
      </div>
    </div>
  `;
}
