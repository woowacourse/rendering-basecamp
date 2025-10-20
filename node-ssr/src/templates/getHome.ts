import type { Movie } from '../service/types';
import { renderHero } from '../views/renderHero';
import { renderMovieList } from '../views/renderMovie';

const renderHead = (): string =>
  [
    `<meta charset="UTF-8" />`,
    `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`,
    `<meta name="description" content="TMDB에서 제공하는 인기 영화 순위를 지금 바로 확인하세요. />`,
    `<link rel="stylesheet" href="/styles/index.css" />`,
    `<title>영화 리뷰</title>`,
  ].join('\n    ');

const renderFooter = (): string => `
      <footer class="footer">
        <p>&copy; 우아한테크코스 All Rights Reserved.</p>
        <p><img src="/images/woowacourse_logo.png" width="180" alt="우아한테크코스" /></p>
      </footer>
`;

export const getHome = (movies: Movie[]): string => {
  return `<!DOCTYPE html>
<html lang="ko">
  <head>
    ${renderHead()}
    <link rel="stylesheet" href="/styles/index.css" />
  </head>
  <body>
    <div id="wrap">
      ${renderHero(movies[0])}
      ${renderMovieList(movies)}
      ${renderFooter()}
    </div>
  </body>
</html>`;
};
