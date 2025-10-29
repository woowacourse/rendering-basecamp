interface MetaOptions {
  title: string;
  description: string;
  image: string;
  url: string;
  type?: string;
}

function generateMetaTag({
  title,
  description,
  image,
  url,
  type = "website",
}: MetaOptions): string {
  return /*html*/ `
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:type" content="${type}" />
  `;
}

export default generateMetaTag;
