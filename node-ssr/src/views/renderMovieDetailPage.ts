import {Movie, MovieDetail} from '../service/types';
import escapeHtml from '../utils/escapeHtml';
import {PageMetadata, posterUrl, renderDocument} from './renderDocument';

type BackgroundPageRenderer = (movies: Movie[]) => string;

export const renderMovieDetailPage = (
	movies: Movie[],
	detailMovie: MovieDetail,
	backgroundPageRenderer: BackgroundPageRenderer,
): string =>
	renderDocument(
		`${backgroundPageRenderer(movies)}${renderModal(detailMovie)}`,
		toPageMetadata(detailMovie),
	);

export const renderModal = (movie: MovieDetail): string => `
    <div class="modal-background active">
      <div class="modal">
        <div class="modal-header">
          <h1 class="modal-title">${escapeHtml(movie.title)}</h1>
          <img src="/images/modal_button_close.png" width="24" height="24" class="modal-close-btn" alt="Close" />
        </div>
        <div class="modal-container">
          <img src="${escapeHtml(posterUrl(movie.poster_path, 'original'))}" alt="${escapeHtml(movie.title)}" class="modal-image" />
          <div class="modal-description">
            <div class="movie-info-line">
              <span class="movie-meta">${escapeHtml(movie.genres.map((genre) => genre.name).join(', '))}</span>
              <div class="movie-rating">
                <img src="/images/star_filled.png" width="16" height="16" alt="별점" />
                <span class="rating-value">${movie.vote_average.toFixed(1)}</span>
              </div>
            </div>
            <div class="overview-section">
              <p class="overview-text">${escapeHtml(movie.overview || '줄거리 정보가 없습니다.')}</p>
            </div>
            <div class="my-rating-section">
              <div class="rating-header">
                <span class="rating-label">내 별점</span>
                <div class="star-rating">
                  ${Array.from({length: 5}, (_, index) => `<img src="/images/star_empty.png" width="24" height="24" alt="Star ${index + 1}" />`).join('')}
                  <span class="rating-text">0 별점을 남겨주세요</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;

const toPageMetadata = (movie: MovieDetail): PageMetadata => {
	const title = `${movie.title}`;
	const description = movie.overview || '영화 상세 정보를 확인해 보세요.';
	const image = posterUrl(movie.backdrop_path ?? movie.poster_path, 'w1280');

	return {
		title,
		description,
		openGraph: {
			title: movie.title,
			description,
			image,
		},
	};
};
