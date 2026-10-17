import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './App';

const { movies, movieDetail } = window.__INITIAL_DATA__;

performance.mark('hydration before');

hydrateRoot(
  document.getElementById('root'),
  <App
    path={window.location.pathname}
    movies={movies}
    movieDetail={movieDetail}
  />
);

performance.mark('hydration after');
performance.measure('hydrateRoot', 'hydration before', 'hydration after');

console.log(
  `hydrateRoot 호출 시간: ${performance.getEntriesByName('hydrateRoot')[0].duration}ms`
);
