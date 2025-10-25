import { OverlayProvider } from "overlay-kit";
import MovieHomePage from "./pages/MovieHomePage";
import type { MovieItem } from "./types/Movie.types";

interface AppProps {
  initialData?: MovieItem[];
}

function App({ initialData }: AppProps) {
  return (
    <OverlayProvider>
      <MovieHomePage initialData={initialData} />
    </OverlayProvider>
  );
}

export default App;
