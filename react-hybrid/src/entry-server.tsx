import 'dotenv/config';

import express from 'express';
import path from 'path';
import { readFile } from 'fs/promises';

import { renderToString } from 'react-dom/server';
import App from './App';
import Document from './Document';
import { FAKE_ORIGIN } from './constants/url';
import { routes } from './routes';
import type { PageData } from './router/context';
import { AppDataContext, type AppData } from './document/context';

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

const staticDirectory = path.join(__dirname, '../static');
app.use('/static', express.static(staticDirectory));

for (const route of routes) {
  app.get(route.path, async (req, res) => {
    const url = new URL(FAKE_ORIGIN + req.originalUrl);
    const routePath = url.pathname + url.search + url.hash;

    const props = route.loader ? await route.loader({ params: req.params, path: routePath }) : {};

    const initialPage: PageData = {
      path: routePath,
      props: props as PageData['props'],
    };

    const manifest: AppData = JSON.parse(await readFile(path.join(staticDirectory, 'manifest.json'), 'utf8'));

    const appData: AppData = {
      ...manifest,
      initialPage,
    };

    const html = renderToString(
      <AppDataContext value={appData}>
        <Document>
          <App />
        </Document>
      </AppDataContext>,
    );

    res.send('<!DOCTYPE html>' + html);
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
