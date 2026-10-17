import React, { useState } from "react";
import { OverlayProvider } from "overlay-kit";
import MovieHomePage from "./pages/MovieHomePage";
import { MovieDetailModal } from "./components/MovieDetailModal";
import type { MovieItem } from "./types/Movie.types";
import type { MovieDetailResponse } from "./types/MovieDetail.types";

interface AppProps {
  movies: MovieItem[];
  movieDetail?: MovieDetailResponse | null;
}

function App({ movies, movieDetail = null }: AppProps) {
  const [selectedMovie, setSelectedMovie] = useState(movieDetail);

  return (
    <OverlayProvider>
      <MovieHomePage movies={movies} />

      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          onClose={() => {
            setSelectedMovie(null);
            window.history.pushState(null, "", "/");
          }}
        />
      )}
    </OverlayProvider>
  );
}

export default App;
