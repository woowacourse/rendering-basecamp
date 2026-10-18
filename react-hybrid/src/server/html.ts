const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/**
 * 텍스트를 HTML 본문이나 속성값에 넣을 수 있도록 특수문자를 엔티티로 바꾼다.
 */
export const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char]);

/**
 * 데이터를 <script> 안에 넣을 때 "</script>" 같은 문자열이 태그를 닫지 않도록 "<"를 이스케이프한다.
 */
export const serialize = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");

export interface PageMeta {
  title: string;
  description: string;
  url: string;
  image?: string;
}

export function generateOgTags({ title, description, url, image }: PageMeta) {
  const tags: [string, string | undefined][] = [
    ["og:type", "website"],
    ["og:title", title],
    ["og:description", description],
    ["og:url", url],
    ["og:image", image],
  ];

  return [
    `<meta name="description" content="${escapeHtml(description)}" />`,
    ...tags
      .filter(([, content]) => content)
      .map(([property, content]) => `<meta property="${property}" content="${escapeHtml(content!)}" />`),
    `<meta name="twitter:card" content="summary_large_image" />`,
  ].join("\n        ");
}

interface DocumentOptions {
  meta: PageMeta;
  body: string;
  initialData: unknown;
}

export function generateHTML({ meta, body, initialData }: DocumentOptions) {
  return /*html*/ `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/static/styles/bundle.css" />
        <title>${escapeHtml(meta.title)}</title>
        ${generateOgTags(meta)}
      </head>
      <body>
        <div id="root">${body}</div>
        <script>
          window.__INITIAL_DATA__ = ${serialize(initialData)}
        </script>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
    `;
}

export function generateErrorHTML(message: string) {
  return /*html*/ `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/static/styles/bundle.css" />
        <title>${escapeHtml(message)} | 영화 리뷰</title>
      </head>
      <body>
        <div id="wrap">
          <section class="container">
            <h2 class="text-2xl font-bold mb-64">${escapeHtml(message)}</h2>
            <a href="/">홈으로 돌아가기</a>
          </section>
        </div>
      </body>
    </html>
    `;
}
