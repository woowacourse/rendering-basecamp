import { OverlayProvider } from "overlay-kit";
import { MovieItem } from "./types/Movie.types";

interface InitialData {
  movies: MovieItem[];
  selectedMovieDetail?: MovieItem;
}

function App({ initialData }: { initialData: InitialData }) {
  return <OverlayProvider>App</OverlayProvider>;
}

export default App;
