import React, { useState } from "react";
import type { MovieItem } from "./types/Movie.types";
import MovieHomePage from "./pages/MovieHomePage";
import { MovieDetailModal } from "./components/MovieDetailModal";
import { MovieDetailResponse } from "./types/MovieDetail.types";
import { OverlayProvider } from "overlay-kit";

interface AppProps {
  initialMovies?: MovieItem[];
  initialDetail?: MovieDetailResponse;
}

function App({ initialMovies, initialDetail }: AppProps) {
  const [detail, setDetail] = useState<MovieDetailResponse | null>(
    initialDetail ?? null
  );

  const handleCloseModal = () => {
    setDetail(null);
    if (typeof window !== "undefined") {
      window.history.replaceState({}, "", "/");
    }
  };

  return (
    <OverlayProvider>
      <MovieHomePage initialMovies={initialMovies} />
      {detail ? (
        <MovieDetailModal movie={detail} onClose={handleCloseModal} />
      ) : null}
    </OverlayProvider>
  );
}

export default App;
