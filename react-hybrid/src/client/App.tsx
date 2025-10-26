import React from 'react';
import { OverlayProvider } from 'overlay-kit';
import { BrowserRouter, StaticRouter, Routes, Route } from 'react-router-dom';
import MovieHomePage from './pages/MovieHomePage';
import MovieDetailPage from './pages/MovieDetailPage';

interface AppProps {
  url?: string;
}

function App({ url }: AppProps) {
  const isServer = typeof window === 'undefined';

  const routes = (
    <Routes>
      <Route path="/" element={<MovieHomePage />} />
      <Route path="/detail/:movieId" element={<MovieDetailPage />} />
    </Routes>
  );

  return (
    <OverlayProvider>
      {isServer ? (
        <StaticRouter location={url!}>{routes}</StaticRouter>
      ) : (
        <BrowserRouter>{routes}</BrowserRouter>
      )}
    </OverlayProvider>
  );
}

export default App;
