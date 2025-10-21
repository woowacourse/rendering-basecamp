import { hydrateRoot } from 'react-dom/client';
import App from './App';
import { routes } from './routes';

const initialData = window.__INITIAL_DATA__;
const initialPath = window.__INITIAL_PATH__;

const Component = routes.find((route) => route.path === initialPath).component;

hydrateRoot(
  document.getElementById('root'),
  <App Component={Component} initialData={initialData} />,
);
