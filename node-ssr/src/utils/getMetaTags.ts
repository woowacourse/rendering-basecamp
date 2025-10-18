interface GetMetaTagsParams {
  title: string;
  description: string;
  imageUrl: string;
  pageUrl: string;
}

const getMetaTags = ({
  title,
  description,
  imageUrl,
  pageUrl,
}: GetMetaTagsParams) => `
  <title>${title}</title>
  <meta name="description" content='${description}' />

  <meta property="og:title" content='${title}' />
  <meta property="og:description" content='${description}' />
  <meta property="og:image" content='${imageUrl}' />
  <meta property="og:url" content='${pageUrl}' />
  <meta property="og:type" content="website" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content='${title}' />
  <meta name="twitter:description" content='${description}' />
  <meta name="twitter:image" content='${imageUrl}' />
  <meta name="twitter:url" content='${pageUrl}' />
`;
