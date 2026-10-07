import type { Movie } from '../service/types';
import { renderFeaturedMovie } from './renderFeaturedMovie';
import { renderFeaturedMovieFallback } from './renderFeaturedMovieFallback';
import { renderMovieList } from './renderMovieList';
import { renderMovieListFallback } from './renderMovieListFallback';

export function renderIndex(movies: Movie[]): string {
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
        ${movies.length > 0 ? renderFeaturedMovie(movies[0]) : renderFeaturedMovieFallback()}
        <main>
          ${movies.length > 0 ? renderMovieList(movies) : renderMovieListFallback()}
        </main>
        <footer class="footer">
          <p>&copy; 우아한테크코스 All Rights Reserved.</p>
          <p><img src="/images/woowacourse_logo.png" width="180" alt="우아한테크코스" /></p>
        </footer>
      </div>
      <!-- TODO: 영화 상세 모달 -->
    </body>

    </html>
  `;
}
