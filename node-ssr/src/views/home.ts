import { Movie } from "../service/types";
import { escapeHtml } from "../utils/escapeHtml";
import { TMDB_IMAGE_URL } from "./constants";

const renderHeader = (movie: Movie) => {
  const backgroundStyle = movie.poster_path
    ? `style="background-image: url(${TMDB_IMAGE_URL}/w1920_and_h800_multi_faces${escapeHtml(movie.poster_path)});"`
    : "";

  return /*html*/ `
    <header>
      <div class="background-container" ${backgroundStyle}>
        <div class="overlay"></div>
        <div class="top-rated-container">
          <img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" />
          <div class="top-rated-movie">
            <div class="rate">
              <img src="/images/star_empty.png" width="32" height="32" />
              <span class="text-2xl font-semibold text-yellow">${movie.vote_average}</span>
            </div>
            <h1 class="text-3xl font-semibold">${escapeHtml(movie.title)}</h1>
            <button class="primary detail">자세히 보기</button>
          </div>
        </div>
      </div>
    </header>`;
};

const renderMovieItem = (movie: Movie) => {
  const imageUrl = movie.poster_path
    ? `${TMDB_IMAGE_URL}/w500${movie.poster_path}`
    : "/images/no_image.png";

  return /*html*/ `
    <li class="movie-item">
      <div class="item">
        <img class="thumbnail" src="${escapeHtml(imageUrl)}" alt="${escapeHtml(movie.title)}" loading="lazy" />
        <div class="item-desc">
          <p class="rate">
            <img src="/images/star_empty.png" class="star" />
            <span>${movie.vote_average.toFixed(1)}</span>
          </p>
          <strong>${escapeHtml(movie.title)}</strong>
        </div>
      </div>
    </li>`;
};

/**
 * public/index.html의 구조를 그대로 따르되, 고정된 예시 데이터 대신 TMDB 데이터를 넣는다.
 */
export const renderHome = (movies: Movie[]) => /*html*/ `
  <div id="wrap">
    ${movies.length > 0 ? renderHeader(movies[0]) : ""}
    <main>
      <section class="container">
        <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
        <ul class="thumbnail-list">
          ${movies.map(renderMovieItem).join("")}
        </ul>
      </section>
    </main>
    <footer class="footer">
      <p>&copy; 우아한테크코스 All Rights Reserved.</p>
      <p><img src="/images/woowacourse_logo.png" width="180" alt="우아한테크코스" /></p>
    </footer>
  </div>`;
