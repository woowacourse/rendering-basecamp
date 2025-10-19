import { Movie } from '../service/types';

export const renderHero = (movie: Movie): string => {
  const movieImage = `https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/${movie.backdrop_path}`;

  return `
      <header>
  <div class="background-container"
             style="background-image: url(${movieImage});">
                       <div class="overlay"></div>
          <div class="top-rated-container">
            <img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" />
            <div class="top-rated-movie">
              <div class="rate">
                <img src="/images/star_empty.png" width="32" height="32" />
                <span class="text-2xl font-semibold text-yellow">${movie.vote_average.toFixed(
                  1
                )}</span>
              </div>
              <h1 class="text-3xl font-semibold">${movie.title}</h1>
              <button class="primary detail">자세히 보기</button>
            </div>
          </div>
        </div>
      </header>
  `;
};
