import { Movie, MovieDetail } from './service/types';

export const html = {
  mainHtml: (movies: Movie[], html?: string) => /*html*/ `
  <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/styles/index.css" />
        <title>영화 리뷰</title>
      </head>
      <body>
        <div id="wrap">
          <header>
            <div class="background-container" style="background-image: url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/${
              movies[0].poster_path
            };">
              <div class="overlay"></div>
              <div class="top-rated-container">
                <img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" />
                <div class="top-rated-movie">
                  <div class="rate">
                    <img src="/images/star_empty.png" width="32" height="32" />
                    <span class="text-2xl font-semibold text-yellow">${
                      movies[0].vote_average
                    }</span>
                  </div>
                  <h1 class="text-3xl font-semibold">${movies[0].title}</h1>
                  <button class="primary detail"><a href=${`detail/${movies[0].id}`}>자세히 보기</a></button>
                </div>
              </div>
            </div>
        </header>     
        <main>
          <section class="container">
            <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
            <ul class="thumbnail-list">
              ${movies
                .map(
                  (movie) => /*html*/ `
                <li class="movie-item">
                  <a href=${`/detail/${movie.id}`}>
                    <div class="item">
                      <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/${
                        movie.poster_path
                      }" alt="${movie.title}" loading="lazy" />
                      <div class="item-desc">
                        <p class="rate">
                          <img src="/images/star_empty.png" class="star" />
                          <span>${movie.vote_average}</span>
                        </p>
                        <strong>${movie.title}</strong>
                      </div>
                    </div>
                  </a>
                </li>`
                )
                .join('')}
            </ul>
          </section>
        </main>
        <footer class="footer">
        <p>&copy; 우아한테크코스 All Rights Reserved.</p>
        <p><img src="/images/woowacourse_logo.png" width="180" alt="우아한테크코스" /></p>
      </footer>
      ${html}
      </body>
    </html>
  `,
  modalHtml: (movie: MovieDetail) => /*html*/ `
  <div class="modal-background active">
      <div class="modal">
        <!-- 모달 헤더 -->
        <div class="modal-header">
          <h1 class="modal-title">${movie.title}</h1>
          <a href="/"><img src="/images/modal_button_close.png" width="24" height="24" class="modal-close-btn" alt="Close" /></a>

        </div>

        <div class="modal-container">
          <img src="https://image.tmdb.org/t/p/original/${
            movie.poster_path
          }" alt="${movie.title}" class="modal-image" />
          <div class="modal-description">
            <!-- 영화 정보 섹션 -->
            <div class="movie-info-line">
              <span class="movie-meta">${movie.genres
                .map((genre) => genre.name)
                .join(',')}</span>
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

            <!-- 내 별점 섹션 -->
            <div class="my-rating-section">
              <div class="rating-header">
                <span class="rating-label">내 별점</span>
                <div class="star-rating">
                  <img src="/images/star_filled.png" width="24" height="24" alt="Star 1" />
                  <img src="/images/star_filled.png" width="24" height="24" alt="Star 2" />
                  <img src="/images/star_filled.png" width="24" height="24" alt="Star 3" />
                  <img src="/images/star_filled.png" width="24" height="24" alt="Star 4" />
                  <img src="/images/star_empty.png" width="24" height="24" alt="Star 5" />
                  <span class="rating-text">8 재미있어요</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
};
