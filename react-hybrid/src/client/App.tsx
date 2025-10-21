import { OverlayProvider } from "overlay-kit";
import { MovieItem } from "./types/Movie.types";
import { MovieDetailResponse } from "./types/MovieDetail.types";

interface InitialData {
  movies: MovieItem[];
  selectedMovieDetail?: MovieDetailResponse;
}

function App({ initialData }: { initialData: InitialData }) {
  return <OverlayProvider>App</OverlayProvider>;
}

export default App;
