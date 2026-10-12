import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import Document from './Document';
import { AppDataContext, APP_DATA_ID, type AppData } from './document/context';

const serializedData = document.getElementById(APP_DATA_ID)?.textContent;
if (!serializedData) throw new Error('HTML에 초기 앱 데이터가 필요합니다.');
const appData: AppData = JSON.parse(serializedData);

const element = (
  <AppDataContext value={appData}>
    <Document>
      <App />
    </Document>
  </AppDataContext>
);

if (appData.initialPage === undefined) {
  createRoot(document).render(element);
} else {
  hydrateRoot(document, element);
}
