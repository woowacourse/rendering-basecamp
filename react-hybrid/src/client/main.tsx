import { hydrateRoot } from 'react-dom/client';
import App from './App';

const initialData = window.__INITIAL_DATA__;
const root = document.getElementById('root');

if (!root) {
  throw new Error('React 앱을 연결할 #root 요소를 찾지 못했습니다.');
}

performance.mark('beforeRender');
hydrateRoot(root, <App initialData={initialData} />);
performance.mark('afterHydrate');
performance.measure('hydration', 'beforeRender', 'afterHydrate');
