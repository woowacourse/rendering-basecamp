import React from "react";
import { OverlayProvider } from "overlay-kit";
import type { MovieItem } from "./types/Movie.types";
import type { MovieDetailResponse } from "./types/MovieDetail.types";
import MovieHomePage from "./pages/MovieHomePage";
import { MovieDetailModal } from "./components/MovieDetailModal";

interface AppProps {
  initialMovies?: MovieItem[];
  initialDetail?: MovieDetailResponse | null;
}

function App({ initialMovies, initialDetail }: AppProps) {
  const handleCloseModal = () => {
    window.location.href = "/";
  };

  return (
    <OverlayProvider>
      <MovieHomePage initialMovies={initialMovies} />
      {initialDetail ? (
        <MovieDetailModal movie={initialDetail} onClose={handleCloseModal} />
      ) : null}
    </OverlayProvider>
  );
}

export default App;
