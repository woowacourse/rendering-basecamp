export const IMAGE_BASE_URL = process.env.TMDB_IMAGE_BASE_URL ?? 'https://image.tmdb.org/t/p';

export const posterUrl = (path: string | null, size: string): string =>
	path ? `${IMAGE_BASE_URL}/${size}${path}` : '/images/no_image.png';

export const renderDocument = (content: string): string => `
  <!DOCTYPE html>
  <html lang="ko">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="stylesheet" href="/styles/index.css" />
      <title>영화 리뷰</title>
    </head>
    <body>${content}</body>
  </html>`;
