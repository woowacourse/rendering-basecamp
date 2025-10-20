import React from "react";
import { OverlayProvider } from "overlay-kit";
import MovieDetailPage from "./pages/MovieDetailPage";
import MovieHomePage from "./pages/MovieHomePage";

function App() {
  const isDetailPage = window.location.pathname.startsWith("/detail/");

  return (
    <OverlayProvider>
      {isDetailPage ? <MovieDetailPage /> : <MovieHomePage />}
    </OverlayProvider>
  );
}

export default App;
