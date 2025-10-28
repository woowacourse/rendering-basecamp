import { OverlayProvider } from "overlay-kit";
import { Activity } from "react";
import MovieDetailPage from "./pages/MovieDetailPage";
import MovieHomePage from "./pages/MovieHomePage";
import { MovieItem } from "./types/Movie.types";
import { MovieDetailResponse } from "./types/MovieDetail.types";

type Props = {
  path: string;
  movies: MovieItem[];
  movieDetail?: MovieDetailResponse;
};

function App({ path, movies, movieDetail }: Props) {
  return (
    <OverlayProvider>
      <Activity mode={path === "/" ? "visible" : "hidden"}>
        <MovieHomePage movies={movies} />
      </Activity>
      <Activity mode={path.startsWith("/movies/") ? "visible" : "hidden"}>
        <MovieDetailPage movies={movies} movieDetail={movieDetail} />
      </Activity>
    </OverlayProvider>
  );
}

export default App;
