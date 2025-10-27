export interface createSEOProps {
  title: string;
  description: string;
  ogType: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
}

export function createSEO({
  title,
  description,
  ogType,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
}: createSEOProps) {
  return /*html*/ `
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>${title}</title>
        <meta name="description" content="${description}" />
        <meta property="og:type" content="${ogType}" />
        <meta property="og:title" content="${ogTitle}" />
        <meta property="og:description" content="${ogDescription}" />
        <meta property="og:image" content="${ogImage}" />
        <meta property="og:url" content="${ogUrl}" />
      </head>
  `;
}
