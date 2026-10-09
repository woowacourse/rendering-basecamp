import { MovieDetail } from "../service/types";
import { escapeHtml } from "./escapeHtml";
import { posterUrl } from "./image";

const renderEmptyStars = () =>
  Array.from(
    { length: 5 },
    (_, index) =>
      `<img src="/images/star_empty.png" width="24" height="24" alt="Star ${index + 1}" />`
  ).join("");

export const renderModal = (movie: MovieDetail) => {
  const title = escapeHtml(movie.title);
  const genres = escapeHtml(movie.genres.map((genre) => genre.name).join(", "));
  const overview = escapeHtml(movie.overview || "줄거리 정보가 없습니다.");

  return /*html*/ `
    <div class="modal-background active">
      <div class="modal">
        <div class="modal-header">
          <h1 class="modal-title">${title}</h1>
          <a href="/"><img src="/images/modal_button_close.png" width="24" height="24" class="modal-close-btn" alt="Close" /></a>
        </div>

        <div class="modal-container">
          <img src="${posterUrl(movie.poster_path)}" alt="${title}" class="modal-image" />
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
                  ${renderEmptyStars()}
                  <span class="rating-text">별점을 남겨주세요</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};
