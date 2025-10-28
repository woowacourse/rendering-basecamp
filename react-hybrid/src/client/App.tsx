import React from 'react';
import { OverlayProvider } from 'overlay-kit';
import { BrowserRouter, StaticRouter, Routes, Route } from 'react-router-dom';
import MovieHomePage from './pages/MovieHomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import { MovieItem } from './types/Movie.types';

interface AppProps {
  url?: string;
  initialMovies?: MovieItem[];
}

function App({ url, initialMovies }: AppProps) {
  const isServer = typeof window === 'undefined';

  const routes = (
    <Routes>
      <Route
        path="/"
        element={<MovieHomePage initialMovies={initialMovies} />}
      />
      <Route
        path="/detail/:movieId"
        element={<MovieDetailPage initialMovies={initialMovies} />}
      />
    </Routes>
  );

  return (
    <OverlayProvider>
      {isServer ? (
        <StaticRouter location={url}>{routes}</StaticRouter>
      ) : (
        <BrowserRouter>{routes}</BrowserRouter>
      )}
    </OverlayProvider>
  );
}

export default App;
