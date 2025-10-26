import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

declare global {
  interface Window {
    __INITIAL_DATA__: any;
    __INITIAL_URL__: string;
  }
}

const initialData = window.__INITIAL_DATA__;
console.log('initialData', initialData);

hydrateRoot(
  document.getElementById('root')!,
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
