import React from "react";
import { OverlayProvider } from "overlay-kit";
import MovieHomePage from "./pages/MovieHomePage";
// import MovieDetailPage from "./pages/MovieDetailPage";

function App() {
  return (
    <OverlayProvider>
      <MovieHomePage />
    </OverlayProvider>
  );
}

export default App;
