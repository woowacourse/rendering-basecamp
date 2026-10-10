import escapeHtml from '../utils/escapeHtml';

export const IMAGE_BASE_URL = process.env.TMDB_IMAGE_BASE_URL ?? 'https://image.tmdb.org/t/p';

export interface PageMetadata {
	title: string;
	description: string;
	openGraph?: {
		title?: string;
		description?: string;
		image?: string;
	};
}

const DEFAULT_PAGE_METADATA: PageMetadata = {
	title: '영화 리뷰',
	description: '지금 인기 있는 영화와 영화 상세 정보를 확인해 보세요.',
};

export const posterUrl = (path: string | null, size: string): string =>
	path ? `${IMAGE_BASE_URL}/${size}${path}` : '/images/no_image.png';

export const renderDocument = (content: string, metadata?: PageMetadata): string => {
	const pageMetadata = metadata ?? DEFAULT_PAGE_METADATA;

	const defaultTitleSuffix = ` | ${DEFAULT_PAGE_METADATA.title}`;
	const title =
		pageMetadata.title === DEFAULT_PAGE_METADATA.title ||
		pageMetadata.title.endsWith(defaultTitleSuffix)
			? pageMetadata.title
			: `${pageMetadata.title}${defaultTitleSuffix}`;

	return `
  <!DOCTYPE html>
  <html lang="ko">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="stylesheet" href="/styles/index.css" />
      <title>${escapeHtml(title)}</title>
      <meta name="description" content="${escapeHtml(pageMetadata.description)}" />
      <meta property="og:title" content="${escapeHtml(pageMetadata.openGraph?.title ?? pageMetadata.title)}" />
      <meta property="og:description" content="${escapeHtml(pageMetadata.openGraph?.description ?? pageMetadata.description)}" />
      ${pageMetadata.openGraph?.image ? `<meta property="og:image" content="${escapeHtml(pageMetadata.openGraph.image)}" />` : ''}
    </head>
    <body>${content}</body>
  </html>`;
};
