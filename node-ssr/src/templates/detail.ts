import { Movie, MovieDetail } from "../service/types";

interface DetailPageData {
  movie: MovieDetail;
  topRatedMovie: Movie;
  popularMovies: Movie[];
}

export const detailTemplate = (data: DetailPageData): string => {
  const { movie, topRatedMovie, popularMovies } = data;
  const { title, genres, overview, vote_average, poster_path } = movie;

  const backdropUrl = topRatedMovie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${topRatedMovie.backdrop_path}`
    : "";

  return /*html*/ `
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
            <div class="background-container" style="background-image: url(${backdropUrl});">
              <div class="overlay"></div>
              <div class="top-rated-container">
                <img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" />
                <div class="top-rated-movie">
                  <div class="rate">
                    <img src="/images/star_empty.png" width="32" height="32" />
                    <span class="text-2xl font-semibold text-yellow">${topRatedMovie.vote_average.toFixed(
                      1
                    )}</span>
                  </div>
                  <h1 class="text-3xl font-semibold">${topRatedMovie.title}</h1>
                  <button class="primary detail">자세히 보기</button>
                </div>
              </div>
            </div>
          </header>
          <main>
            <section class="container">
              <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
              <ul class="thumbnail-list">
                ${popularMovies
                  .map(movie => {
                    const posterUrl = movie.poster_path
                      ? `https://media.themoviedb.org/t/p/w440_and_h660_face${movie.poster_path}`
                      : "/images/no_image.png";

                    return `
                      <li class="movie-item">
                        <div class="item">
                          <img class="thumbnail" src="${posterUrl}" alt="${
                      movie.title
                    }" loading="lazy" />
                          <div class="item-desc">
                            <p class="rate">
                              <img src="/images/star_empty.png" class="star" />
                              <span>${movie.vote_average.toFixed(1)}</span>
                            </p>
                            <strong>${movie.title}</strong>
                          </div>
                        </div>
                      </li>
                    `;
                  })
                  .join("")}
              </ul>
            </section>
          </main>
          <footer class="footer">
            <p>&copy; 우아한테크코스 All Rights Reserved.</p>
            <p><img src="/images/woowacourse_logo.png" width="180" alt="우아한테크코스" /></p>
          </footer>
        </div>

        <div class="modal-background active">
          <div class="modal">
            <!-- 모달 헤더 -->
            <div class="modal-header">
              <h1 class="modal-title">${title}</h1>
              <img src="/images/modal_button_close.png" width="24" height="24" class="modal-close-btn" alt="Close" />
            </div>

            <div class="modal-container">
              <img src="${
                poster_path
                  ? `https://image.tmdb.org/t/p/original${poster_path}`
                  : "/images/no_image.png"
              }" alt="${title}" class="modal-image" />
              <div class="modal-description">
                <!-- 영화 정보 섹션 -->
                <div class="movie-info-line">
                  <span class="movie-meta">${genres
                    .map(genre => genre.name)
                    .join(", ")}</span>
                  <div class="movie-rating">
                    <img src="/images/star_filled.png" width="16" height="16" />
                    <span class="rating-value">${vote_average.toFixed(1)}</span>
                  </div>
                </div>

                <!-- 줄거리 -->
                <div class="overview-section">
                  <p class="overview-text">
                    ${overview || "줄거리 정보가 없습니다."}
                  </p>
                </div>

                <!-- 내 별점 섹션 -->
                <div class="my-rating-section">
                  <div class="rating-header">
                    <span class="rating-label">내 별점</span>
                    <div class="star-rating">
                      ${Array.from({ length: 5 }, (_, index) => {
                        return `<img
                            src="/images/star_empty.png"
                            width="24"
                            height="24"
                            alt="Star${index + 1}"
                          />`;
                      }).join("")}
                      <span class="rating-text">별점을 등록해주세요.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
};
