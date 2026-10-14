import 'dotenv/config';

import express from 'express';
import path from 'path';
import manifest from '../dist/static/manifest.json';

import App from './App';
import { renderDocument } from './framework/renderDocument';
import { FAKE_ORIGIN } from './framework/router/constants';
import { routes } from './routes';
import type { PageData } from './framework/router/context';
import type { AppData } from './framework/document/context';

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

    const appData: AppData = {
      ...manifest,
      initialPage,
    };

    res.send(renderDocument(appData, <App />));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
