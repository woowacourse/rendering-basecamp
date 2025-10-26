import React from "react";
import { OverlayProvider } from "overlay-kit";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import type { MovieItem } from "./types/Movie.types";
import MovieHomePage from './pages/MovieHomePage';
import MovieDetailPage from './pages/MovieDetailPage';

function App() {
  const initialData = typeof window !== 'undefined' ? window.__INITIAL_DATA__ : { movies: [], detail: null };
  const movies = initialData?.movies || [];
  const detail = initialData?.detail;

  return (
    <OverlayProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MovieHomePage movies={movies as MovieItem[]} />} />
          <Route path="/detail/:movieId" element={<MovieDetailPage movies={movies as MovieItem[]} detail={detail} />} />
        </Routes>
      </BrowserRouter>
    </OverlayProvider>
  );
}

export default App;
