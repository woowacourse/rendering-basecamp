import React from 'react';
import { OverlayProvider } from 'overlay-kit';
import MovieHomePage from './pages/MovieHomePage';

function App() {
  const initialData = window.__INITIAL_DATA__;

  return (
    <OverlayProvider>
      <MovieHomePage movies={initialData.movies} />
    </OverlayProvider>
  );
}

export default App;
