interface TagParams {
  title: string;
  description: string;
  image: string;
  url: string;
}

function renderTags({ title, description, image, url }: TagParams): string {
  return /*html*/ `
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:url" content="${url}" />
  `;
}

export default renderTags;
