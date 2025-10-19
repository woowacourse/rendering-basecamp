import { Movie } from '../service/types';
import { getBannerUrl, getThumbnailUrl, formatRating } from '../utils/helpers';

export const renderMovieListPage = (movies: Movie[]): string => {
  const topMovie = movies[0];
  const bannerUrl = getBannerUrl(topMovie.backdrop_path);
  const topMovieRating = formatRating(topMovie.vote_average);

  return `<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta property="og:title" content="영화 리뷰" />
    <meta property="og:description" content="지금 인기 있는 영화를 확인하세요" />
    <meta property="og:type" content="website" />
    <link rel="stylesheet" href="/styles/index.css" />
    <title>영화 리뷰</title>
  </head>
  <body>
    <div id="wrap">
      <header>
        <div class="background-container" style="background-image: url(${bannerUrl});">
          <div class="overlay"></div>
          <div class="top-rated-container">
            <img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" />
            <div class="top-rated-movie">
              <div class="rate">
                <img src="/images/star_empty.png" width="32" height="32" />
                <span class="text-2xl font-semibold text-yellow">${topMovieRating}</span>
              </div>
              <h1 class="text-3xl font-semibold">${topMovie.title}</h1>
              <button class="primary detail">자세히 보기</button>
            </div>
          </div>
        </div>
      </header>
      <main>
        <section class="container">
          <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
          <ul class="thumbnail-list">
            ${renderMovieItems(movies)}
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
};

const renderMovieItems = (movies: Movie[]): string => {
  return movies
    .map((movie) => {
      const thumbnailUrl = getThumbnailUrl(movie.poster_path);
      const rating = formatRating(movie.vote_average);

      return `
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="${thumbnailUrl}" alt="${movie.title}" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>${rating}</span>
                  </p>
                  <strong>${movie.title}</strong>
                </div>
              </div>
            </li>`;
    })
    .join('');
};
