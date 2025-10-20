import { Movie } from '../service/types';

const renderMovieItem = (movie: Movie): string => {
  const movieImage = `https://media.themoviedb.org/t/p/w440_and_h660_face/${movie.poster_path}`;

  return `
      <li class="movie-item" data-id="${movie.id}">
        <a class="item" href="/detail/${movie.id}" aria-label="${
    movie.title
  } 상세 보기">
          <img class="thumbnail" src="${movieImage}" alt="${
    movie.title
  }" loading="lazy" />
            <div class="item-desc">
              <p class="rate">
                <img src="/images/star_empty.png" class="star" />
                <span>${movie.vote_average.toFixed(1)}</span>
              </p>
              <strong>${movie.title}</strong>
            </div>
        </a>
      </li>`;
};

export const renderMovieList = (movies: Movie[]): string => `
      <main>
        <section class="container">
          <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
          <ul class="thumbnail-list">
            ${movies.map((movie) => renderMovieItem(movie)).join('')}
          </ul>
        </section>
      </main>
`;
