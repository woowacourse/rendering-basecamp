import { Movie } from "../service/types";
import { escapeHtml } from "../utils/escapeHtml";
import { getThumbnailUrl } from "../utils/imageUrl";

const renderMovieItem = (movie: Movie) => /*html*/ `
  <li class="movie-item">
    <a href="/detail/${movie.id}">
      <div class="item">
        <img class="thumbnail" src="${escapeHtml(getThumbnailUrl(movie.poster_path))}" alt="${escapeHtml(movie.title)}" loading="lazy" />
        <div class="item-desc">
          <p class="rate">
            <img src="/images/star_empty.png" class="star" />
            <span>${movie.vote_average.toFixed(1)}</span>
          </p>
          <strong>${escapeHtml(movie.title)}</strong>
        </div>
      </div>
    </a>
  </li>
`;

export const renderMovieList = (movies: Movie[]) => /*html*/ `
  <main>
    <section class="container">
      <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
      <ul class="thumbnail-list">
        ${movies.map(renderMovieItem).join("")}
      </ul>
    </section>
  </main>
`;
