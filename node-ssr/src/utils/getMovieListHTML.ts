import { Movie } from "../service/types";

export const getMovieListHTML = (movies: Movie[]) =>
  movies
    .map((movie) => {
      const movieImageUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w440_and_h660_face${movie.poster_path}`
        : "/images/no_image.png";

      return `
        <li class="movie-item">
          <a href="/detail/${movie.id}">
            <div class="item">
              <img class="thumbnail" src="${movieImageUrl}" alt="${
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
          </a>
        </li>
      `;
    })
    .join("");
