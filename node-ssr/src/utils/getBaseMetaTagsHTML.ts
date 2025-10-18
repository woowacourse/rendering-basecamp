interface BaseMetaTagsParams {
  title?: string;
}

export const getBaseMetaTagsHTML = ({
  title = "영화 리뷰",
}: BaseMetaTagsParams = {}) => `
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="/styles/index.css" />
  <title>${title}</title>
`;
