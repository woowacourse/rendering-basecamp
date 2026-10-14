import { OverlayProvider } from "overlay-kit";
import MovieHomePage from "./pages/MovieHomePage";
import type { MovieItem } from "./types/Movie.types";

interface Props {
  movies: MovieItem[];
}

function App({ movies }: Props) {
  return (
    <OverlayProvider>
      <MovieHomePage initialMovies={movies} />
    </OverlayProvider>
  );
}

export default App;
