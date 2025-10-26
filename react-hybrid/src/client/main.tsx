import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './App';

const initialData = window.__INITIAL_DATA__;
console.log('initialData', initialData);

hydrateRoot(
  document.getElementById('root')!,
  <App
    initialMovies={initialData.movies}
    initialMovieDetail={initialData.movieDetail}
    path={initialData.path}
  />,
);
