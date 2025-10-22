interface MetaTagsProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export const generateMetaTags = ({
  title = 'MovieList',
  description = '영화를 검색하고 리뷰를 남겨보세요',
  image = '/static/images/logo.png',
  url = 'https://movie-review.com',
}: MetaTagsProps = {}) => {
  return `
    // Open Graph
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:url" content="${url}" />

    // Twitter
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:title" content="${title}" />
    <meta property="twitter:description" content="${description}" />
    <meta property="twitter:image" content="${image}" />
    <meta property="twitter:url" content="${url}" />
  `;
};
