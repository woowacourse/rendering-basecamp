import { MovieDetail } from "../service/types";
import { escapeHtml } from "../utils/escapeHtml";
import { TMDB_IMAGE_URL } from "./constants";

/**
 * public/modal.html의 모달 부분을 TMDB 상세 데이터로 채운다.
 * 인터랙션은 필요 없으므로 내 별점은 비어 있는 상태(0점)로 그린다.
 */
export const renderModal = (movie: MovieDetail) => {
  const imageUrl = movie.poster_path
    ? `${TMDB_IMAGE_URL}/original${movie.poster_path}`
    : "/images/no_image.png";
  const genreNames = movie.genres.map((genre) => genre.name).join(", ");
  const stars = Array.from(
    { length: 5 },
    (_, index) =>
      `<img src="/images/star_empty.png" width="24" height="24" alt="Star ${index + 1}" />`,
  ).join("");

  return /*html*/ `
    <div class="modal-background active">
      <div class="modal">
        <div class="modal-header">
          <h1 class="modal-title">${escapeHtml(movie.title)}</h1>
          <img src="/images/modal_button_close.png" width="24" height="24" class="modal-close-btn" alt="Close" />
        </div>
        <div class="modal-container">
          <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(movie.title)}" class="modal-image" />
          <div class="modal-description">
            <div class="movie-info-line">
              <span class="movie-meta">${escapeHtml(genreNames)}</span>
              <div class="movie-rating">
                <img src="/images/star_filled.png" width="16" height="16" />
                <span class="rating-value">${movie.vote_average.toFixed(1)}</span>
              </div>
            </div>
            <div class="overview-section">
              <p class="overview-text">${escapeHtml(movie.overview || "줄거리 정보가 없습니다.")}</p>
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
    </div>`;
};
