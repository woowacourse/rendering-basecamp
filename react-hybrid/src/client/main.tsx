import { hydrateRoot } from 'react-dom/client';
import App from './App';

const { page, initialData } = window.__INITIAL_DATA__;

performance.mark('beforeRender');

hydrateRoot(
  document.getElementById('root'),
  <App page={page} initialData={initialData} />
);

performance.mark('afterHydrate');
performance.measure('hydration', 'beforeRender', 'afterHydrate');
