import { Movie } from "../service/types";
import { escapeHtml } from "../utils/escapeHtml";

export const movieItem = (movie: Movie) => {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
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
