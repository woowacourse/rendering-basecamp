import type { ReactNode } from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import Document from '../Document';
import { APP_DATA_ID, AppDataContext } from './document/context';
import type { AppData } from './document/context';
import { createHeadStore } from './head/store';
import { HeadContext } from './head/context';
import { HEAD_PLACEHOLDER } from './document/Head';
import { MetadataTags } from './head/tags';

export function renderDocument(appData: AppData, children?: ReactNode) {
  const headStore = createHeadStore();

  const html = renderToString(
    <AppDataContext value={appData}>
      <HeadContext value={headStore}>
        <Document>{children}</Document>
      </HeadContext>
    </AppDataContext>,
  );

  const head = headStore.getSnapshot();

  const data = JSON.stringify({ ...appData, head }).replace(/</g, '\\u003c');

  const result = html
    .replace(HEAD_PLACEHOLDER, () => renderToStaticMarkup(<MetadataTags tags={head} />))
    .replace(
      `<script id="${APP_DATA_ID}" type="application/json"></script>`,
      () => `<script id="${APP_DATA_ID}" type="application/json">${data}</script>`,
    );

  return '<!DOCTYPE html>' + result;
}
