import type { Movie, MovieDetail } from '../service/types';
import { renderFooter } from '../views/renderFooter';
import { renderHero } from '../views/renderHero';
import { renderMovieList } from '../views/renderMovie';

const renderHead = (detail: MovieDetail): string => {
  const movieImage = `https://image.tmdb.org/t/p/original/${detail.poster_path}`;

  return [
    `<meta charset="UTF-8" />`,
    `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`,
    `<meta name="description" content="${detail.overview}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${detail.title}" />`,
    `<meta property="og:description" content="${detail.overview}" />`,
    `<meta property="og:image" content="${movieImage}" />`,
    `<link rel="stylesheet" href="/styles/index.css" />`,
    `<title>${detail.title}</title>`,
  ].join('\n    ');
};

const renderModal = (detail: MovieDetail): string => {
  const starIcons = Array.from({ length: 5 }, (_, index) => {
    const score = (index + 1) * 2;
    const starSrc =
      score <= Math.round(detail.vote_average / 2) * 2
        ? '/images/star_filled.png'
        : '/images/star_empty.png';
    return `<img src="${starSrc}" width="24" height="24" alt="" />`;
  });
  const movieImage = `https://image.tmdb.org/t/p/original//${detail.poster_path}`;

  return `
    <div class="modal-background active">
      <div class="modal">
        <div class="modal-header">
          <h1 class="modal-title">${detail.title}</h1>
          <img src="/images/modal_button_close.png" width="24" height="24" class="modal-close-btn" alt="닫기 버튼 (동작하지 않음)" />
        </div>
        <div class="modal-container">
          <img src="${movieImage}" alt="${detail.title}" class="modal-image" />
          <div class="modal-description">
            <div class="movie-info-line">
              <span class="movie-meta">${detail.genres
                .map((genre) => genre.name)
                .join(', ')}</span>
              <div class="movie-rating">
                <img src="/images/star_filled.png" width="16" height="16" />
                <span class="rating-value">${detail.vote_average.toFixed(
                  1
                )}</span>
              </div>
            </div>
            <div class="overview-section">
              <p class="overview-text">
                ${detail.overview}
              </p>
            </div>
            <div class="my-rating-section">
              <div class="rating-header">
                <span class="rating-label">내 별점</span>
                <div class="star-rating" aria-hidden="true">
                  ${starIcons.join('')}
                  <span class="rating-text">${detail.vote_average.toFixed(
                    1
                  )} 평점 데이터 제공</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
};

export const getDetail = (movies: Movie[], detail: MovieDetail): string => {
  return `<!DOCTYPE html>
<html lang="ko">
  <head>
    ${renderHead(detail)}
  </head>
  <body>
    <div id="wrap">
      ${renderHero(movies[0])}
      ${renderMovieList(movies)}
      ${renderFooter()}
      ${renderModal(detail)}
    </div>
  </body>
</html>`;
};
