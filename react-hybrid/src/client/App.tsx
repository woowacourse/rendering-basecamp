import React, { useState } from "react";
import { OverlayProvider } from "overlay-kit";
import { MovieItem } from "./types/Movie.types";
import MovieHomePage from "./pages/MovieHomePage";
import { MovieDetailResponse } from "./types/MovieDetail.types";
import { MovieDetailModal } from "./components/MovieDetailModal";

interface AppProps {
  initialData?: {
    movies: MovieItem[];
    movieDetail?: MovieDetailResponse;
  };
}

function App({ initialData }: AppProps) {
  const [selectedMovie, setSelectedMovie] = useState<MovieDetailResponse | null>(
    initialData?.movieDetail ?? null
  );

  const handleCloseModal = () => {
    setSelectedMovie(null);
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", "/");
    }
  };

  return (
    <OverlayProvider>
      <MovieHomePage initialMovies={initialData?.movies} />
      
      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          onClose={handleCloseModal}
        />
      )}
    </OverlayProvider>
  );
}

export default App;
