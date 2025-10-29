import React from "react";
import { OverlayProvider } from "overlay-kit";
import MovieHomePage from "./pages/MovieHomePage";
import MovieDetailPage from "./pages/MovieDetailPage";

interface AppProps {
  url?: string;
}

function App({ url = "/" }: AppProps) {
  const isDetailPage = url.startsWith("/detail/");

  return (
    <OverlayProvider>
      {isDetailPage ? <MovieDetailPage /> : <MovieHomePage />}
    </OverlayProvider>
  );
}

export default App;
