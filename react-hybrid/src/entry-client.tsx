import { createRoot, hydrateRoot } from 'react-dom/client';
import { createHeadStore } from './framework/head/store';
import { HeadContext } from './framework/head/context';
import App from './App';
import Document from './Document';
import { AppDataContext, APP_DATA_ID } from './framework/document/context';
import type { AppData } from './framework/document/context';

const serializedData = document.getElementById(APP_DATA_ID)?.textContent;
if (!serializedData) throw new Error('HTML에 초기 앱 데이터가 필요합니다.');
const appData: AppData = JSON.parse(serializedData);

const headStore = createHeadStore(appData.head);

const element = (
  <AppDataContext value={appData}>
    <HeadContext value={headStore}>
      <Document>
        <App />
      </Document>
    </HeadContext>
  </AppDataContext>
);

if (appData.initialPage === undefined) {
  createRoot(document).render(element);
} else {
  hydrateRoot(document, element);
}
