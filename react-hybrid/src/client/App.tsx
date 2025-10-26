import { OverlayProvider } from "overlay-kit";
import MovieDetailPage from "./pages/MovieDetailPage";
import MovieHomePage from "./pages/MovieHomePage";
import { MovieItem } from "./types/Movie.types";
import { MovieDetailResponse } from "./types/MovieDetail.types";

interface AppProps {
  initialMovies?: {
    movies: MovieItem[];
    details?: MovieDetailResponse | null;
  };
}

function App({ initialMovies }: AppProps) {
  return (
    <OverlayProvider>
      {initialMovies.details ? (
        <MovieDetailPage initialMovies={initialMovies} />
      ) : (
        <MovieHomePage initialMovies={initialMovies} />
      )}
    </OverlayProvider>
  );
}

export default App;
