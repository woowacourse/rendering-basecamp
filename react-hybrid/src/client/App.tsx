import React from "react";
import {OverlayProvider} from "overlay-kit";
import MovieHomePage from "./pages/MovieHomePage";
import MovieDetailPage from "./pages/MovieDetailPage";

interface AppProps {
  url?: string;
  movieId?: string;
}

function App({url = "/", movieId}: AppProps) {
  const isDetailPage = url.startsWith("/detail/");

  return (
    <OverlayProvider>
      {isDetailPage && movieId ?
        <MovieDetailPage movieId={movieId}/>
        :
        <MovieHomePage/>
      }
    </OverlayProvider>
  );
}

export default App;
