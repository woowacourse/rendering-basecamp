import { MovieDetail } from '../service/types';
import {
  getImageUrl,
  formatRating,
  getGenreNamesFromDetail,
} from '../utils/helpers';

export const renderMovieDetailPage = (movie: MovieDetail): string => {
  const posterUrl = getImageUrl(movie.poster_path);
  const rating = formatRating(movie.vote_average);
  const genres = getGenreNamesFromDetail(movie.genres);

  // OG 태그를 위한 URL (Railway 배포 후 실제 URL로 변경 필요)
  const baseUrl = process.env.BASE_URL || 'http://localhost:8080';
  const pageUrl = `${baseUrl}/detail/${movie.id}`;
  const ogImage = getImageUrl(movie.poster_path, 'w500');

  return `<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta property="og:title" content="${movie.title}" />
    <meta property="og:description" content="${movie.overview}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:url" content="${pageUrl}" />
    <meta property="og:type" content="video.movie" />
    <link rel="stylesheet" href="/styles/index.css" />
    <title>${movie.title} - 영화 리뷰</title>
  </head>
  <body>
    <div id="wrap">
      <header>
        <div class="background-container">
          <div class="overlay"></div>
          <div class="top-rated-container">
            <img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" />
          </div>
        </div>
      </header>
      <main>
        <section class="container">
          <div class="modal-background active">
            <div class="modal">
              <!-- 모달 헤더 -->
              <div class="modal-header">
                <h1 class="modal-title">${movie.title}</h1>
                <img src="/images/modal_button_close.png" width="24" height="24" class="modal-close-btn" alt="Close" />
              </div>

              <div class="modal-container">
                <img src="${posterUrl}" alt="${movie.title}" class="modal-image" />
                <div class="modal-description">
                  <!-- 영화 정보 섹션 -->
                  <div class="movie-info-line">
                    <span class="movie-meta">${genres}</span>
                    <div class="movie-rating">
                      <img src="/images/star_filled.png" width="16" height="16" />
                      <span class="rating-value">${rating}</span>
                    </div>
                  </div>

                  <!-- 줄거리 -->
                  <div class="overview-section">
                    <p class="overview-text">
                      ${movie.overview}
                    </p>
                  </div>

                  <!-- 내 별점 섹션 -->
                  <div class="my-rating-section">
                    <div class="rating-header">
                      <span class="rating-label">내 별점</span>
                      <div class="star-rating">
                        <img src="/images/star_empty.png" width="24" height="24" alt="Star 1" />
                        <img src="/images/star_empty.png" width="24" height="24" alt="Star 2" />
                        <img src="/images/star_empty.png" width="24" height="24" alt="Star 3" />
                        <img src="/images/star_empty.png" width="24" height="24" alt="Star 4" />
                        <img src="/images/star_empty.png" width="24" height="24" alt="Star 5" />
                        <span class="rating-text">평가하기</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer class="footer">
        <p>&copy; 우아한테크코스 All Rights Reserved.</p>
        <p><img src="/images/woowacourse_logo.png" width="180" alt="우아한테크코스" /></p>
      </footer>
    </div>
  </body>
</html>`;
};
