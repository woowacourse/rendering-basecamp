import React, { useEffect } from "react";
import { OverlayProvider } from "overlay-kit";
import MovieHomePage from "./pages/MovieHomePage";
import { MovieItem } from "./types/Movie.types";
import { MovieDetailResponse } from "./types/MovieDetail.types";
import { useMovieDetailModal } from "./hooks/useMovieDetailModal";

interface AppProps {
  initialMovies: MovieItem[];
  detailMovie?: MovieDetailResponse;
}

function App({ initialMovies, detailMovie }: AppProps) {
  const { openMovieDetailModal } = useMovieDetailModal();

  useEffect(() => {
    if (detailMovie) {
      openMovieDetailModal(detailMovie);
    }
  }, [detailMovie]);

  return (
    <OverlayProvider>
      <MovieHomePage initialMovies={initialMovies} />
    </OverlayProvider>
  );
}

export default App;
