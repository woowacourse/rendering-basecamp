interface OpenGraphMetadata {
  title: string;
  description: string;
  url: string;
  type?: string;
  siteName?: string;
  image?: string;
  imageWidth?: string;
  imageHeight?: string;
  keywords?: string;
}

interface HTMLTemplateOptions {
  title: string;
  metadata: OpenGraphMetadata;
  bodyContent?: string;
  initialData?: Record<string, unknown>;
  stylesheets?: string[];
  scripts?: string[];
}

const JOINNER = '';

export function generateHTMLTemplate({
  title,
  metadata,
  bodyContent = '<!--{BODY_AREA}-->',
  initialData,
  stylesheets = ['/static/styles/index.css'],
  scripts = ['/static/bundle.js'],
}: HTMLTemplateOptions): string {
  const ogTags = generateOpenGraphTags(metadata);
  const dataScript = initialData ? generateInitialDataScript(initialData) : '';

  return /*html*/ `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        ${stylesheets
          .map((href) => `<link rel="stylesheet" href="${href}" />`)
          .join(JOINNER)}
        <title>${title}</title>
        ${ogTags}
      </head>
      <body>
        <div id="root">${bodyContent}</div>
        ${dataScript}
        ${scripts.map((src) => `<script src="${src}"></script>`).join(JOINNER)}
      </body>
    </html>
  `;
}

function generateOpenGraphTags(metadata: OpenGraphMetadata): string {
  return [
    `<meta property="og:title" content="${metadata.title}" />`,
    `<meta name="description" content="${metadata.description}" />`,
    `<meta property="og:url" content="${metadata.url}" />`,
    `<meta property="og:type" content="${metadata.type ?? 'website'} " />`,
    metadata.keywords &&
      `<meta name="keywords" content="${metadata.keywords}" />`,
    `<meta property="og:description" content="${metadata.description}" />`,
    metadata.siteName &&
      `<meta property="og:site_name" content="${metadata.siteName}" />`,
    metadata.image &&
      `<meta property="og:image" content="${metadata.image}" />`,
    `<meta property="og:image:width" content="${
      metadata.imageWidth ?? 450
    }" />`,
    `<meta property="og:image:height" content="${
      metadata.imageHeight ?? 300
    } " />`,
  ]
    .flat()
    .filter(Boolean)
    .join(JOINNER);
}

function generateInitialDataScript(data: Record<string, unknown>): string {
  return /*html*/ `
    <script>
      window.__INITIAL_DATA__ = ${JSON.stringify(data)}
      window.__INITIAL_PATH__ = "/";
    </script>
  `;
}
