import type { Movie } from '../service/types';

export function renderFeaturedMovie(movie: Movie): string {
  return /*html*/ `
    <header>
      <div
        class="background-container"
        ${
          movie.backdrop_path
            ? `style="background-image: url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${movie.backdrop_path});"`
            : ''
        }
      >
        <div class="overlay"></div>
        <div class="top-rated-container">
          <img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" />
          <div class="top-rated-movie">
            <div class="rate">
              <img src="/images/star_empty.png" width="32" height="32" />
              <span class="text-2xl font-semibold text-yellow">${movie.vote_average}</span>
            </div>
            <h1 class="text-3xl font-semibold">${movie.title}</h1>
            <!-- TODO: 영화 상세 모달 -->
            <button class="primary detail">자세히 보기</button>
          </div>
        </div>
      </div>
    </header>
  `;
}
