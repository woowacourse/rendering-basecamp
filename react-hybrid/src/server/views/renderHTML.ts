import { MovieItem } from '../../client/types/Movie.types';
import { MovieDetailResponse } from '../../client/types/MovieDetail.types';

interface HtmlParams {
  renderApp: string;
  page: 'home' | 'detail';
  initialData: {
    movies: MovieItem[];
    movieItem?: MovieDetailResponse;
  };
  title: string;
  metaTags?: string;
}

function renderHTML({
  renderApp,
  page,
  initialData,
  title,
  metaTags,
}: HtmlParams) {
  return /*html*/ `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/static/styles/index.css" />
        <title>${title}</title>
        ${metaTags}
        <!--{OG_TAGS}-->
      </head>
      <body>
        <div id="root">${renderApp}</div>
        <script>
          window.__INITIAL_DATA__ = ${JSON.stringify({
            page,
            initialData,
          })}
        </script>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
    `;
}

export default renderHTML;
