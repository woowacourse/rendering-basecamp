import React from "react";
import { OverlayProvider } from "overlay-kit";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MovieHomePage from "./pages/MovieHomePage";
import MovieDetailPage from "./pages/MovieDetailPage";
import { MovieItem } from "./types/Movie.types";

type InitialData = {
  movies?: MovieItem[];
};

function App({ initialData }: { initialData: InitialData }) {
  return (
    <OverlayProvider>
      <Routes>
        <Route
          path="/"
          element={<MovieHomePage movies={initialData.movies} />}
        />
        <Route path="/detail/:movieId" element={<MovieDetailPage />} />
      </Routes>
    </OverlayProvider>
  );
}
export default App;
