import { OverlayProvider } from "overlay-kit";
import type { MovieItem } from "./types/Movie.types";
import MovieHomePage from "./pages/MovieHomePage";

function App({ initialMovie }: { initialMovie: MovieItem[] }) {
  return (
    <OverlayProvider>
      <MovieHomePage movies={initialMovie} />
    </OverlayProvider>
  );
}

export default App;
