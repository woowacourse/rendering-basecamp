import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const initialData = window.__INITIAL_DATA__;

performance.mark('beforeRender');

hydrateRoot(
  document.getElementById('root'),
  <BrowserRouter>
    <App
      movies={initialData.movies}
      movieDetail={initialData.movieDetail}
    />
  </BrowserRouter>,
);

performance.mark('afterHydrate');
performance.measure('hydration', 'beforeRender', 'afterHydrate');
