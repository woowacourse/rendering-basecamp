import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './App';

const { movies, movieDetail } = window.__INITIAL_DATA__;

hydrateRoot(
  document.getElementById('root'),
  <App
    path={window.location.pathname}
    movies={movies}
    movieDetail={movieDetail}
  />
);
