import 'dotenv/config';

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import { renderToString } from 'react-dom/server';
import App from './App';
import { ORIGIN } from './constants/url';
import { routes } from './routes';
import type { InitialData } from './router/context';

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/static', express.static(path.join(__dirname, '../dist/static')));

function generateHTML() {
  return /*html*/ `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/static/styles/index.css" />
        <title>영화 리뷰</title>
        <!--{OG_TAGS}-->
      </head>
      <body>
        <div id="root"><!--{BODY_AREA}--></div>
        <!--{INIT_DATA_AREA}-->
        <script src="/static/bundle.js"></script>
      </body>
    </html>
    `;
}

for (const route of routes) {
  app.get(route.path, async (req, res) => {
    const host = req.get('host');

    const origin = host ? `${req.protocol}://${host}` : ORIGIN;
    const url = new URL(req.originalUrl, origin);

    const initialData: InitialData = {
      url: url.href,
      props: route.loader ? await route.loader({ params: req.params, url }) : {},
    };

    const renderedApp = renderToString(<App initialData={initialData} />);

    const serializedData = JSON.stringify(initialData).replace(/</g, '\\u003c');

    const html = generateHTML()
      .replace('<!--{BODY_AREA}-->', () => renderedApp)
      .replace('<!--{INIT_DATA_AREA}-->', () => `<script>window.__INITIAL_DATA__ = ${serializedData};</script>`);

    res.send(html);
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
