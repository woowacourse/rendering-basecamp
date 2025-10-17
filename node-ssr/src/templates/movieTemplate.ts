import { Movie, MovieResponse } from '../service/types';

/**
 * 영화 아이템을 HTML로 렌더링하는 함수
 */
function renderMovieItem(movie: Movie): string {
  const posterUrl = movie.poster_path
    ? `https://media.themoviedb.org/t/p/w440_and_h660_face${movie.poster_path}`
    : '/images/no_image.png';

  const rating = movie.vote_average.toFixed(1);

  return `
    <li class="movie-item">
      <div class="item">
        <img class="thumbnail" src="${posterUrl}" alt="${movie.title}" loading="lazy" />
        <div class="item-desc">
          <p class="rate">
            <img src="/images/star_empty.png" class="star" />
            <span>${rating}</span>
          </p>
          <strong>${movie.title}</strong>
        </div>
      </div>
    </li>
  `;
}

/**
 * 영화 목록을 HTML로 렌더링하는 함수
 */
export function renderMovieList(movieData: MovieResponse): string {
  const movieItems = movieData.results.map(renderMovieItem).join('');

  // 첫 번째 영화를 메인 배너로 사용
  const featuredMovie = movieData.results[0];
  const backdropUrl = featuredMovie?.backdrop_path
    ? `https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${featuredMovie.backdrop_path}`
    : 'https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/stKGOm8UyhuLPR9sZLjs5AkmncA.jpg';

  const featuredRating = featuredMovie?.vote_average.toFixed(1) || '7.7';
  const featuredTitle = featuredMovie?.title || '인사이드 아웃 2';

  return `<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/styles/index.css" />
    <title>영화 리뷰</title>
  </head>
  <body>
    <div id="wrap">
      <header>
        <div class="background-container" style="background-image: url(${backdropUrl});">
          <div class="overlay"></div>
          <div class="top-rated-container">
            <img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" />
            <div class="top-rated-movie">
              <div class="rate">
                <img src="/images/star_empty.png" width="32" height="32" />
                <span class="text-2xl font-semibold text-yellow">${featuredRating}</span>
              </div>
              <h1 class="text-3xl font-semibold">${featuredTitle}</h1>
              <button class="primary detail">자세히 보기</button>
            </div>
          </div>
        </div>
      </header>
      <main>
        <section class="container">
          <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
          <ul class="thumbnail-list">
            ${movieItems}
          </ul>
        </section>
      </main>
      <footer class="footer">
        <p>&copy; 우아한테크코스 All Rights Reserved.</p>
        <p><img src="/images/woowacourse_logo.png" width="180" alt="우아한테크코스" /></p>
      </footer>
    </div>
  </body>
</html>`;
}
