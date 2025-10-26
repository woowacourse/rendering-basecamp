interface OgTag {
  title?: string;
  description?: string;
  image?: string;
  [key: string]: string;
}

export const generateOgTag = (ogTagInfo: OgTag) => {
  return /*html*/ `
    ${Object.keys(ogTagInfo)
      .map((key) => /*html*/ `<meta property="og:${key}" content="${ogTagInfo[key]}" />`)
      .join('\n')}
  `;
};
