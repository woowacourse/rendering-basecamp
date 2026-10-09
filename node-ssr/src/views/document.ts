import { escapeHtml } from "./escapeHtml";
import { INLINE_STYLES } from "./styles";

interface DocumentContent {
  title: string;
  head?: string;
  body: string;
}

export const renderDocument = ({ title, head = "", body }: DocumentContent) => /*html*/ `<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>${INLINE_STYLES}</style>
    <title>${escapeHtml(title)}</title>
    ${head}
  </head>
  <body>
    ${body}
  </body>
</html>
`;
