import { renderToString } from 'react-dom/server';
import App from '../../client/App';
import type { InitialData } from '../../client/types/InitialData.types';

export interface PageMetadata {
  title: string;
  description: string;
  image?: string;
}

const DEFAULT_METADATA: PageMetadata = {
  title: '영화 리뷰',
  description: '지금 인기 있는 영화와 영화 상세 정보를 확인해 보세요.',
};

const escapeHtml = (value: string): string =>
  value.replace(
    /[&<>"']/g,
    character =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[character]!
  );

const serializeInitialData = (initialData: InitialData): string =>
  JSON.stringify(initialData)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

export const renderDocument = (
  initialData: InitialData,
  metadata: PageMetadata = DEFAULT_METADATA
): string => {
  const renderedApp = renderToString(<App initialData={initialData} />);
  const title = escapeHtml(metadata.title);
  const description = escapeHtml(metadata.description);

  return `<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/static/styles/index.css" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="website" />
    ${metadata.image ? `<meta property="og:image" content="${escapeHtml(metadata.image)}" />` : ''}
  </head>
  <body>
    <div id="root">${renderedApp}</div>
    <script>window.__INITIAL_DATA__ = ${serializeInitialData(initialData)};</script>
    <script src="/static/bundle.js"></script>
  </body>
</html>`;
};
