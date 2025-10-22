import { MovieDetailResponse } from '../service/types';
import { escapeHtml } from '../utils/escapeHtml';

interface GetDetailHtmlParams {
  movie: MovieDetailResponse;
  baseUrl: string;
}

export const getDetailHtml = ({ movie, baseUrl }: GetDetailHtmlParams): string => {
  const { title, genres, overview, vote_average, poster_path, backdrop_path, release_date } = movie;

  const genreNames = genres.map((genre) => genre.name).join(', ');
  const imageUrl = poster_path
    ? `https://image.tmdb.org/t/p/original${poster_path}`
    : '/images/no_image.png';
  const backdropUrl = backdrop_path
    ? `https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${backdrop_path}`
    : '/images/no_image.png';

  return /*html*/ `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/styles/index.css" />
        
        <!-- SEO 및 OG 태그 -->
        <title>${escapeHtml(title)} - 영화 리뷰</title>
        <meta name="description" content="${escapeHtml(overview.slice(0, 150))}..." />
        
        <!-- Open Graph -->
        <meta property="og:type" content="movie" />
        <meta property="og:site_name" content="영화 리뷰" />
        <meta property="og:title" content="${escapeHtml(title)} - 영화 리뷰" />
        <meta property="og:description" content="${escapeHtml(overview.slice(0, 150))}..." />
        <meta property="og:image" content="${imageUrl}" />
        <meta property="og:image:width" content="500" />
        <meta property="og:image:height" content="750" />
        <meta property="og:url" content="${baseUrl}/detail/${movie.id}" />
        <meta property="og:locale" content="ko_KR" />
        
        <!-- 추가 영화 메타데이터 -->
        <meta property="og:release_date" content="${release_date}" />
        <meta property="og:rating" content="${vote_average}" />
        <meta property="og:genre" content="${escapeHtml(genreNames)}" />
        
        <!-- Twitter Card -->
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@moviereview" />
        <meta name="twitter:title" content="${escapeHtml(title)} - 영화 리뷰" />
        <meta name="twitter:description" content="${escapeHtml(overview.slice(0, 150))}..." />
        <meta name="twitter:image" content="${imageUrl}" />
      </head>
      <body>
        <div id="wrap">
          <header>
            <div class="background-container" style="background-image: url(${backdropUrl});">
              <div class="overlay"></div>
              <div class="top-rated-container">
                <img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" />
                <div class="top-rated-movie">
                  <div class="rate">
                    <img src="/images/star_empty.png" width="32" height="32" />
                    <span class="text-2xl font-semibold text-yellow">${vote_average.toFixed(1)}</span>
                  </div>
                  <h1 class="text-3xl font-semibold">${title}</h1>
                </div>
              </div>
            </div>
          </header>
          <main>
            <div class="modal-background active">
              <div class="modal">
                <div class="modal-header">
                  <h1 class="modal-title">${title}</h1>
                </div>

                <div class="modal-container">
                  <img src="${imageUrl}" alt="${title}" class="modal-image" />
                  <div class="modal-description">
                    <div class="movie-info-line">
                      <span class="movie-meta">${genreNames}</span>
                      <div class="movie-rating">
                        <img src="/images/star_filled.png" width="16" height="16" />
                        <span class="rating-value">${vote_average.toFixed(1)}</span>
                      </div>
                    </div>

                    <div class="overview-section">
                      <p class="overview-text">
                        ${overview || '줄거리 정보가 없습니다.'}
                      </p>
                    </div>

                    <div class="movie-meta-info">
                      <p>개봉일: ${release_date}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <footer class="footer">
            <p>&copy; 우아한테크코스 All Rights Reserved.</p>
            <p><img src="/images/woowacourse_logo.png" width="180" alt="우아한테크코스" /></p>
          </footer>
        </div>
      </body>
    </html>
  `;
};
