import { OverlayProvider } from "overlay-kit";
import type { MovieItem } from "./types/Movie.types";
import MovieHomePage from "./pages/MovieHomePage";
import { useEffect } from "react";
import { useMovieDetailModal } from "./hooks/useMovieDetailModal";
import type { MovieDetailResponse } from "./types/MovieDetail.types";

function App({
  initialMovies,
  detail,
}: {
  initialMovies: MovieItem[];
  detail?: MovieDetailResponse;
}) {
  const { openMovieDetailModal } = useMovieDetailModal();

  useEffect(() => {
    if (detail) {
      openMovieDetailModal(detail);
    }
  }, [detail, openMovieDetailModal]);

  return (
    <OverlayProvider>
      <MovieHomePage movies={initialMovies} />
    </OverlayProvider>
  );
}

export default App;
