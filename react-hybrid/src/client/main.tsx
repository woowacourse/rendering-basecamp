import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './App';
import MovieHomePage from './pages/MovieHomePage';
import MovieDetailPage from './pages/MovieDetailPage';

const initialData = window.__INITIAL_DATA__;
const initialRoute = window.__INITIAL_ROUTE__;

console.log('initialData', initialData);

const routes = [
  { path: '/', component: MovieHomePage },
  { path: '/detail/:id', component: MovieDetailPage },
];

const Component = routes.find((route) => route.path === initialRoute).component;

hydrateRoot(
  document.getElementById('root'),
  <App Component={Component} initialData={initialData} />
);
