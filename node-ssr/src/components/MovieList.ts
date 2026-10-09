import type { Movie } from "../service/types";

export const MovieList = (movies: Movie[]) =>
  movies
    .map(
      (movie) => `
    <li class="movie-item">
      <div class="item">
        <img class="thumbnail"
          src="${movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/images/no_image.png"}"
          alt="${movie.title}" loading="lazy" />
        <div class="item-desc">
          <p class="rate">
            <img src="/images/star_empty.png" class="star" alt="" />
            <span>${movie.vote_average}</span>
          </p>
          <strong>${movie.title}</strong>
        </div>
      </div>
    </li>
  `,
    )
    .join("");
