import React from 'react';
import { OverlayProvider } from 'overlay-kit';
import MovieHomePage from './pages/MovieHomePage';

function App() {
  return (
    <OverlayProvider>
      <MovieHomePage />
    </OverlayProvider>
  );
}

export default App;
