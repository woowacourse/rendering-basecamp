import React from "react";
import { OverlayProvider } from "overlay-kit";
import type { MovieItem } from "./types/Movie.types";

function App({ movies }: { movies: MovieItem[] }) {
  return (
    <OverlayProvider>
      <main>
        <h1>지금 인기 있는 영화</h1>
        <p>전달받은 영화 개수: {movies.length}</p>
        <ul>
          {movies.map((movie) => (
            <li key={movie.id}>{movie.title}</li>
          ))}
        </ul>
      </main>
    </OverlayProvider>
  );
}

export default App;
