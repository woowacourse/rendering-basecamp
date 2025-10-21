import React from "react";
import { Routes, Route } from "react-router-dom";
import { OverlayProvider } from "overlay-kit";
import MovieHomePage from "./pages/MovieHomePage";
import MovieDetailPage from "./pages/MovieDetailPage";
import { MovieItem } from "./types/Movie.types";

interface AppProps {
  initialMovies?: MovieItem[];
}

function App({ initialMovies }: AppProps) {
  return (
    <OverlayProvider>
      <Routes>
        <Route
          path="/"
          element={<MovieHomePage initialMovies={initialMovies} />}
        />
        <Route path="/movie/:id" element={<MovieDetailPage />} />
      </Routes>
    </OverlayProvider>
  );
}

export default App;
