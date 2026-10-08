import { Movie } from "../service/types";
import { escapeHtml } from "./escapeHtml";
import { backdropUrl, posterUrl } from "./image";

const renderHeader = (featured: Movie) => {
  const title = escapeHtml(featured.title);
  const background = backdropUrl(featured.backdrop_path);

  return /*html*/ `
    <header>
      <div class="background-container" style="background-image: url(${background});">
        <div class="overlay"></div>
        <div class="top-rated-container">
          <a href="/"><img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" /></a>
          <div class="top-rated-movie">
            <div class="rate">
              <img src="/images/star_empty.png" width="32" height="32" />
              <span class="text-2xl font-semibold text-yellow">${featured.vote_average.toFixed(1)}</span>
            </div>
            <h1 class="text-3xl font-semibold">${title}</h1>
            <a href="/detail/${featured.id}"><button class="primary detail">자세히 보기</button></a>
          </div>
        </div>
      </div>
    </header>
  `;
};

const renderMovieItem = (movie: Movie) => {
  const title = escapeHtml(movie.title);

  return /*html*/ `
    <li class="movie-item">
      <a href="/detail/${movie.id}">
        <div class="item">
          <img class="thumbnail" src="${posterUrl(movie.poster_path)}" alt="${title}" loading="lazy" />
          <div class="item-desc">
            <p class="rate">
              <img src="/images/star_empty.png" class="star" />
              <span>${movie.vote_average.toFixed(1)}</span>
            </p>
            <strong>${title}</strong>
          </div>
        </div>
      </a>
    </li>
  `;
};

const renderFooter = () => /*html*/ `
  <footer class="footer">
    <p>&copy; 우아한테크코스 All Rights Reserved.</p>
    <p><img src="/images/woowacourse_logo.png" width="180" alt="우아한테크코스" /></p>
  </footer>
`;

export const renderHome = (movies: Movie[]) => /*html*/ `
  <div id="wrap">
    ${renderHeader(movies[0])}
    <main>
      <section class="container">
        <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
        <ul class="thumbnail-list">
          ${movies.map(renderMovieItem).join("")}
        </ul>
      </section>
    </main>
    ${renderFooter()}
  </div>
`;
