import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './App';

const initialData = window.__INITIAL_DATA__;
const movies = initialData.movies;

hydrateRoot(document.getElementById('root'), <App movies={movies} />);
