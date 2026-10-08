import { MovieDetail } from "../service/types";
import { escapeHtml } from "../utils/escapeHtml";
import { getOriginalPosterUrl } from "../utils/imageUrl";

const STAR_COUNT = 5;

export const EMPTY_OVERVIEW_TEXT = "줄거리 정보가 없습니다.";

// 서버는 sessionStorage 의 별점을 알 수 없으므로 react-csr 의 초기 상태(0점)로 렌더한다.
const renderMyRating = () => /*html*/ `
  <div class="my-rating-section">
    <div class="rating-header">
      <span class="rating-label">내 별점</span>
      <div class="star-rating">
        ${Array.from(
          { length: STAR_COUNT },
          (_, index) => /*html*/ `<img src="/images/star_empty.png" width="24" height="24" alt="Star ${index + 1}" />`
        ).join("")}
        <span class="rating-text">0 별점을 남겨주세요</span>
      </div>
    </div>
  </div>
`;

export const renderMovieDetailModal = (movie: MovieDetail) => {
  const { title, genres, overview, vote_average, poster_path } = movie;
  const genreNames = genres.map((genre) => genre.name).join(", ");

  return /*html*/ `
    <div class="modal-background active">
      <div class="modal">
        <!-- 모달 헤더 -->
        <div class="modal-header">
          <h1 class="modal-title">${escapeHtml(title)}</h1>
          <a href="/">
            <img src="/images/modal_button_close.png" width="24" height="24" class="modal-close-btn" alt="Close" />
          </a>
        </div>

        <div class="modal-container">
          <img src="${escapeHtml(getOriginalPosterUrl(poster_path))}" alt="${escapeHtml(title)}" class="modal-image" />
          <div class="modal-description">
            <!-- 영화 정보 섹션 -->
            <div class="movie-info-line">
              <span class="movie-meta">${escapeHtml(genreNames)}</span>
              <div class="movie-rating">
                <img src="/images/star_filled.png" width="16" height="16" />
                <span class="rating-value">${vote_average.toFixed(1)}</span>
              </div>
            </div>

            <!-- 줄거리 -->
            <div class="overview-section">
              <p class="overview-text">${escapeHtml(overview || EMPTY_OVERVIEW_TEXT)}</p>
            </div>

            <!-- 내 별점 섹션 -->
            ${renderMyRating()}
          </div>
        </div>
      </div>
    </div>
  `;
};
