import { OverlayProvider } from "overlay-kit";
import MovieHomePage from "./pages/MovieHomePage";
import { MovieItem } from "./types/Movie.types";

function App({ initialMovies }: { initialMovies: MovieItem[] }) {
  return (
    <OverlayProvider>
      <MovieHomePage initialMovies={initialMovies} />
    </OverlayProvider>
  );
}

export default App;
