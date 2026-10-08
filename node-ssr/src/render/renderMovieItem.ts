import type { Movie } from '../service/types';

export function renderMovieItem(movie: Movie): string {
  return /*html*/ `
    <li class="movie-item">
      <a
        class="item"
        href="/detail/${movie.id}"
        onclick="
          if (typeof window.openMovieDetailModal === 'function' && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
            event.preventDefault();
            window.openMovieDetailModal('${movie.id}');
          }
        "
      >
        <img
          class="thumbnail"
          alt="${movie.title}"
          src="${
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w440_and_h660_face${movie.poster_path}`
              : '/images/no_image.png'
          }"
          loading="lazy"
          onerror="this.onerror = null; this.src = '/images/no_image.png';"
        />
        <div class="item-desc">
          <p class="rate">
            <img src="/images/star_empty.png" class="star" />
            <span>${movie.vote_average}</span>
          </p>
          <strong>${movie.title}</strong>
        </div>
      </a>
    </li>
  `;
}
