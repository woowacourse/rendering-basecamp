export function buildHtml({ title, meta = '', body }: { title: string; meta?: string; body: string }) {
  return `<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/styles/index.css" />
    <title>${title}</title>
    ${meta}
  </head>
  <body>
    ${body}
  </body>
</html>`;
}
