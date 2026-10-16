import React from "react";
import { OverlayProvider } from "overlay-kit";

import MovieHomePage from "./pages/MovieHomePage";

function App() {
  const props = global.window?.__INITIAL_DATA__;

  return (
    <OverlayProvider>
      <MovieHomePage movies={props?.movies} />
    </OverlayProvider>
  );
}

export default App;
