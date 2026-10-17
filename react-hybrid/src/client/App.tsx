import React, { useState } from "react";
import type { MovieItem } from "./types/Movie.types";
import { MovieList } from "./components/MovieList";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { OverlayProvider } from "overlay-kit";
import type { MovieDetailResponse } from "./types/MovieDetail.types";
import { MovieDetailModal } from "./components/MovieDetailModal";

function App({
  movies,
  movieDetail,
}: {
  movies: MovieItem[];
  movieDetail?: MovieDetailResponse;
}) {
  const [selectedMovie, setSelectedMovie] =
    useState<MovieDetailResponse | null>(movieDetail ?? null);

  return (
    <OverlayProvider>
      <Header featuredMovie={movies[0]} />
      <MovieList movies={movies} />
      <Footer />

      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </OverlayProvider>
  );
}

export default App;
