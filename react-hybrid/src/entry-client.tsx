import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';

const root = document.getElementById('root');
if (!root) throw new Error('루트 요소를 찾을 수 없습니다.');

const initialData = window.__INITIAL_DATA__;

if (initialData === undefined) {
  createRoot(root).render(<App />);
} else {
  hydrateRoot(root, <App initialData={initialData} />);
}
