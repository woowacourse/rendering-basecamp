import React from "react";
import { OverlayProvider } from "overlay-kit";
import MovieHomePage from "./pages/MovieHomePage";
import MovieDetailPage from "./pages/MovieDetailPage";
import { useInitialData } from "./contexts/InitialDataContext";

function App() {
  const { movieDetail } = useInitialData();

  return (
    <OverlayProvider>
      {movieDetail ? <MovieDetailPage /> : <MovieHomePage />}
    </OverlayProvider>
  );
}

export default App;
