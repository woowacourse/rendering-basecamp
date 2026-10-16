import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './App';
import Document from './Document';

const initialData = window.__INITIAL_DATA__;
console.log('initialData', initialData);

hydrateRoot(
    document,
    <Document initialData={initialData}>
        <App initialPathname={window.location.pathname} initialData={initialData} />
    </Document>
);
