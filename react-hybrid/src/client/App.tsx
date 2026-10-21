import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    // 초기 hydration commit 이후 Effect 실행 시점까지 측정한다.
    performance.mark("afterHydrate");
    performance.measure("hydration", "beforeRender", "afterHydrate");
  }, []);

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
