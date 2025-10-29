import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

declare global {
  interface Window {
    __INITIAL_DATA__: any;
  }
}

const initialData = window.__INITIAL_DATA__;
console.log('initialData', initialData);

performance.mark('beforeRender');

hydrateRoot(
  document.getElementById('root')!,
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

performance.mark('afterHydrate');
performance.measure('hydration', 'beforeRender', 'afterHydrate');

const measure = performance.getEntriesByName('hydration')[0];
console.log('Hydration 소요시간:', measure.duration.toFixed(2), 'ms');
