import { Movie } from '../service/types';

interface GetIndexHtmlParams {
  movies: Movie[];
  featuredMovie: Movie;
}

export const getIndexHtml = ({ movies, featuredMovie }: GetIndexHtmlParams): string => {
  return /*html*/ `
    <!DOCTYPE html>
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
            <div class="background-container" style="background-image: url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${
              featuredMovie.backdrop_path
            });">
              <div class="overlay"></div>
              <div class="top-rated-container">
                <img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" />
                <div class="top-rated-movie">
                  <div class="rate">
                    <img src="/images/star_empty.png" width="32" height="32" />
                    <span class="text-2xl font-semibold text-yellow">${featuredMovie.vote_average.toFixed(
                      1,
                    )}</span>
                  </div>
                  <h1 class="text-3xl font-semibold">${featuredMovie.title}</h1>
                  <button class="primary detail">자세히 보기</button>
                </div>
              </div>
            </div>
          </header>
          <main>
            <section class="container">
              <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
              <ul class="thumbnail-list">
                ${movies
                  .map(
                    (movie) => `
                  <li class="movie-item">
                    <div class="item">
                      <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face${
                        movie.poster_path
                      }" alt="${movie.title}" loading="lazy" />
                      <div class="item-desc">
                        <p class="rate">
                          <img src="/images/star_empty.png" class="star" />
                          <span>${movie.vote_average.toFixed(1)}</span>
                        </p>
                        <strong>${movie.title}</strong>
                      </div>
                    </div>
                  </li>
                `,
                  )
                  .join('')}
              </ul>
            </section>
          </main>
          <footer class="footer">
            <p>&copy; 우아한테크코스 All Rights Reserved.</p>
            <p><img src="/images/woowacourse_logo.png" width="180" alt="우아한테크코스" /></p>
          </footer>
        </div>
      </body>
    </html>
  `;
};
