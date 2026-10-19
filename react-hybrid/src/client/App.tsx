import React, { useState } from "react";
import { OverlayProvider } from "overlay-kit";
import { Button } from "./components/common/Button";
import type { MovieItem } from "./types/Movie.types";

function App({ movies }: { movies: MovieItem[] }) {
  const [count, setCount] = useState(0);

  return (
    <OverlayProvider>
      <main>
        <p>전달받은 영화 개수: {movies.length}</p>
      </main>
    </OverlayProvider>
  );
}

export default App;
