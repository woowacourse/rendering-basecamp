import React from 'react';
import { OverlayProvider } from 'overlay-kit';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MovieHomePage from './pages/MovieHomePage';
import MovieDetailPage from './pages/MovieDetailPage';

function App() {
  return (
    <OverlayProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MovieHomePage />} />
          <Route path="/detail/:movieId" element={<MovieDetailPage />} />
        </Routes>
      </BrowserRouter>
    </OverlayProvider>
  );
}

export default App;
