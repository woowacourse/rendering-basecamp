import type { Movie, MovieDetailResponse } from "../service/types";
import { MovieList } from "./MovieList";

const MovieDetail = (movie: MovieDetailResponse) => `
  <div class="modal-background active">
    <div class="modal">
      <div class="modal-header">
        <h1 class="modal-title">${movie.title}</h1>
        <img src="/images/modal_button_close.png" width="24" height="24" class="modal-close-btn" alt="Close" />
      </div>
      <div class="modal-container">
        <img src="${movie.poster_path ? `https://image.tmdb.org/t/p/original${movie.poster_path}` : "/images/no_image.png"}" alt="${movie.title}" class="modal-image" />
        <div class="modal-description">
          <div class="movie-info-line">
            <span class="movie-meta">${movie.genres.map((genre) => genre.name).join(", ")}</span>
            <div class="movie-rating">
              <img src="/images/star_filled.png" width="16" height="16" alt="" />
              <span class="rating-value">${movie.vote_average.toFixed(1)}</span>
            </div>
          </div>
          <div class="overview-section">
            <p class="overview-text">${movie.overview || "줄거리 정보가 없습니다."}</p>
          </div>
          <div class="my-rating-section">
            <div class="rating-header">
              <span class="rating-label">내 별점</span>
              <div class="star-rating">
                ${Array.from({ length: 5 }, (_, index) => `<img src="/images/star_empty.png" width="24" height="24" alt="Star ${index + 1}" />`).join("")}
                <span class="rating-text">0 별점을 남겨주세요</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

export const MovieDetailPage = (
  movies: Movie[],
  movieDetail: MovieDetailResponse,
  ogTags: string,
) => {
  const featuredMovie = movies[0];
  const movieListHtml = MovieList(movies);
  const modalHtml = MovieDetail(movieDetail);

  return /*html*/ `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/styles/index.css" />
        <title>${movieDetail.title} | 영화 리뷰</title>
        ${ogTags}
      </head>
      <body>
        <div id="wrap">
          <header>
            <div class="background-container" style="${featuredMovie.backdrop_path ? `background-image: url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${featuredMovie.backdrop_path});` : ""}">
              <div class="overlay"></div>
              <div class="top-rated-container">
                <img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" />
                <div class="top-rated-movie">
                  <div class="rate">
                    <img src="/images/star_empty.png" width="32" height="32" alt="" />
                    <span class="text-2xl font-semibold text-yellow">${featuredMovie.vote_average}</span>
                  </div>
                  <h1 class="text-3xl font-semibold">${featuredMovie.title}</h1>
                  <button class="primary detail">자세히 보기</button>
                </div>
              </div>
            </div>
          </header>
          <main>
            <section class="container">
              <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
              <ul class="thumbnail-list">${movieListHtml}</ul>
            </section>
          </main>
          <footer class="footer">
            <p>&copy; 우아한테크코스 All Rights Reserved.</p>
            <p><img src="/images/woowacourse_logo.png" width="180" alt="우아한테크코스" /></p>
          </footer>
        </div>
        ${modalHtml}
      </body>
    </html>
  `;
};
