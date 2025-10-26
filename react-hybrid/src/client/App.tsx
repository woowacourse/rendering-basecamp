import { OverlayProvider } from "overlay-kit";
import type { MovieItem } from "./types/Movie.types";
import MovieHomePage from "./pages/MovieHomePage";

function App({ initialMovies }: { initialMovies: MovieItem[] }) {
  return (
    <OverlayProvider>
      <MovieHomePage movies={initialMovies} />
    </OverlayProvider>
  );
}

export default App;
