import { SITE_NAME } from "../constants/site";
import { Movie, MovieDetail } from "../service/types";
import { renderDocument } from "./document";
import { escapeHtml } from "./escapeHtml";
import { renderHomeContent } from "./homePage";
import { NO_IMAGE_PATH, getTmdbImageUrl } from "./tmdbImage";

const STAR_COUNT = 5;

interface DetailPageContent {
  movies: Movie[];
  movie: MovieDetail;
  origin: string;
}

const getDescription = ({ title, overview }: MovieDetail) =>
  overview || `${title}의 평점과 정보를 확인해 보세요.`;

const renderOpenGraphTags = (movie: MovieDetail, origin: string) => {
  const imagePath = movie.backdrop_path ?? movie.poster_path;
  const imageUrl = imagePath ? getTmdbImageUrl("w780", imagePath) : `${origin}${NO_IMAGE_PATH}`;
  const description = escapeHtml(getDescription(movie));

  return /*html*/ `
    <meta name="description" content="${description}" />
    <meta property="og:type" content="video.movie" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:url" content="${escapeHtml(`${origin}/detail/${movie.id}`)}" />
    <meta property="og:title" content="${escapeHtml(movie.title)}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${escapeHtml(imageUrl)}" />
  `;
};

const renderEmptyStars = () =>
  Array.from(
    { length: STAR_COUNT },
    (_, index) =>
      /*html*/ `<img src="/images/star_empty.png" width="24" height="24" alt="Star ${index + 1}" />`
  ).join("");

const renderMovieDetailModal = ({ title, genres, overview, vote_average, poster_path }: MovieDetail) => {
  const imageUrl = poster_path ? getTmdbImageUrl("original", poster_path) : NO_IMAGE_PATH;
  const genreNames = genres.map((genre) => genre.name).join(", ");

  return /*html*/ `
    <div class="modal-background active">
      <div class="modal">
        <div class="modal-header">
          <h1 class="modal-title">${escapeHtml(title)}</h1>
          <img src="/images/modal_button_close.png" width="24" height="24" class="modal-close-btn" alt="Close" />
        </div>

        <div class="modal-container">
          <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(title)}" class="modal-image" />
          <div class="modal-description">
            <div class="movie-info-line">
              <span class="movie-meta">${escapeHtml(genreNames)}</span>
              <div class="movie-rating">
                <img src="/images/star_filled.png" width="16" height="16" />
                <span class="rating-value">${vote_average.toFixed(1)}</span>
              </div>
            </div>

            <div class="overview-section">
              <p class="overview-text">${escapeHtml(overview || "줄거리 정보가 없습니다.")}</p>
            </div>

            <div class="my-rating-section">
              <div class="rating-header">
                <span class="rating-label">내 별점</span>
                <div class="star-rating">
                  ${renderEmptyStars()}
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

export const renderDetailPage = ({ movies, movie, origin }: DetailPageContent) =>
  renderDocument({
    title: `${movie.title} | ${SITE_NAME}`,
    head: renderOpenGraphTags(movie, origin),
    body: `${renderHomeContent(movies)}${renderMovieDetailModal(movie)}`,
  });
