interface OGTagsOptions {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'video.movie';
  siteName?: string;
}

export const generateOGTags = (options: OGTagsOptions): string => {
  const { title, description, image, url, type = 'website', siteName = '영화 리뷰' } = options;

  const tags = [
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:site_name" content="${siteName}" />`,
  ];

  if (description) {
    tags.push(`<meta property="og:description" content="${description}" />`);
    tags.push(`<meta name="description" content="${description}" />`);
  }

  if (image) {
    tags.push(`<meta property="og:image" content="${image}" />`);
  }

  if (url) {
    tags.push(`<meta property="og:url" content="${url}" />`);
  }

  // Twitter 카드 추가
  tags.push(`<meta name="twitter:card" content="summary_large_image" />`);
  tags.push(`<meta name="twitter:title" content="${title}" />`);

  if (description) {
    tags.push(`<meta name="twitter:description" content="${description}" />`);
  }

  if (image) {
    tags.push(`<meta name="twitter:image" content="${image}" />`);
  }

  return tags.join('\n    ');
};
