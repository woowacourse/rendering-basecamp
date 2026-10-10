import type { Movie } from '../service/types';
import { renderMovieItem } from './renderMovieItem';

export function renderMovieList(movies: Movie[]): string {
  return /*html*/ `
    <section class="container">
      <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
      <ul class="thumbnail-list">
        ${movies.map(renderMovieItem).join('')}
      </ul>
    </section>
  `;
}
