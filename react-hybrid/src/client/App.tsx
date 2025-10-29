import { OverlayProvider } from "overlay-kit";
import MovieHomePage from "./pages/MovieHomePage";
import type { MovieItem } from "./types/Movie.types";
import type { MovieDetailResponse } from "./types/MovieDetail.types";
import { useMovieDetailModal } from "./hooks/useMovieDetailModal";
import { useEffect } from "react";

interface AppProps {
  initialData?: MovieItem[];
  movieDetail?: MovieDetailResponse;
}

function App({ initialData, movieDetail }: AppProps) {
  const { openMovieDetailModal } = useMovieDetailModal();

  useEffect(() => {
    if (movieDetail) {
      openMovieDetailModal(movieDetail);
    }
  }, [movieDetail, openMovieDetailModal]);

  return (
    <OverlayProvider>
      <MovieHomePage initialData={initialData} />
    </OverlayProvider>
  );
}

export default App;
