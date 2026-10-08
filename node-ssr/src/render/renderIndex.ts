import { ORIGIN } from '../config';
import type { Movie, MovieDetail } from '../service/types';
import { renderFeaturedMovie } from './renderFeaturedMovie';
import { renderFeaturedMovieFallback } from './renderFeaturedMovieFallback';
import { renderMovieDetailModal } from './renderMovieDetailModal';
import { renderMovieList } from './renderMovieList';
import { renderMovieListFallback } from './renderMovieListFallback';

export function renderIndex(popularMovies: Movie[], selectedMovie?: MovieDetail): string {
  const title = selectedMovie ? `${selectedMovie.title} | 영화 리뷰` : '영화 리뷰';
  const metadata = {
    'og:title': title,
    'og:type': selectedMovie ? 'video.movie' : 'website',
    'og:url': new URL(selectedMovie ? `/detail/${selectedMovie.id}` : '/', ORIGIN).href,
    'og:image': selectedMovie?.poster_path
      ? `https://image.tmdb.org/t/p/original${selectedMovie.poster_path}`
      : new URL('/images/no_image.png', ORIGIN).href,
    'og:description': selectedMovie
      ? selectedMovie.overview || '줄거리 정보가 없습니다.'
      : '인기 영화를 살펴보고 나만의 별점을 남겨보세요.',
  };

  return /*html*/ `
    <!DOCTYPE html>
    <html lang="ko">

    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="stylesheet" href="/styles/index.css" />
      <title>${title}</title>
      <meta property="og:title" content="${metadata['og:title']}" />
      <meta property="og:type" content="${metadata['og:type']}" />
      <meta property="og:url" content="${metadata['og:url']}" />
      <meta property="og:image" content="${metadata['og:image']}" />
      <meta property="og:description" content="${metadata['og:description']}" />
    </head>

    <body>
      <div id="wrap">
        ${popularMovies.length > 0 ? renderFeaturedMovie(popularMovies[0]) : renderFeaturedMovieFallback()}
        <main>
          ${popularMovies.length > 0 ? renderMovieList(popularMovies) : renderMovieListFallback()}
        </main>
        <footer class="footer">
          <p>&copy; 우아한테크코스 All Rights Reserved.</p>
          <p><img src="/images/woowacourse_logo.png" width="180" alt="우아한테크코스" /></p>
        </footer>
      </div>
      ${renderMovieDetailModal(selectedMovie)}

    </body>

    </html>
  `;
}
