interface LayoutProps {
  title: string;
  head?: string;
  body: string;
}

export const renderLayout = ({ title, head = "", body }: LayoutProps) => /*html*/ `
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/styles/index.css" />
    <title>${title}</title>
    ${head}
  </head>
  <body>
    ${body}
  </body>
</html>
`;
