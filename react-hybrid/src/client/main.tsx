import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './App';

const { movies, movieDetail } = window.__INITIAL_DATA__;

performance.mark('beforeRender');

hydrateRoot(
  document.getElementById('root'),
  <App
    path={window.location.pathname}
    movies={movies}
    movieDetail={movieDetail}
  />
);

performance.mark('afterHydrate');
performance.measure('hydration', 'beforeRender', 'afterHydrate');

console.log(
  `hydrateRoot 호출 시간: ${performance.getEntriesByName('hydration')[0].duration}ms`
);
