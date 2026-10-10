import { hydrateRoot } from 'react-dom/client';
import App from './App';

const root = document.getElementById('root');
if (!root) throw new Error('Root element was not found.');

hydrateRoot(root, <App />);
