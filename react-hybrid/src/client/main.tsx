import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './App';

const initialData = window.__INITIAL_DATA__;
console.log('initialData', initialData);

performance.mark('hydration-start');

hydrateRoot(
  document.getElementById('root'),
  <App movies={initialData.movies} />,
);

performance.mark('hydrateRoot-returned');

performance.measure(
  'hydrateRoot-call',
  'hydration-start',
  'hydrateRoot-returned',
);
