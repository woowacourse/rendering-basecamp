export interface OGTagsParams {
  title: string;
  description: string;
  url: string;
  image: string;
}

export function generateOGTags({
  title,
  description,
  url,
  image,
}: OGTagsParams): string {
  return /*html*/ `
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${image}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
  `;
}
