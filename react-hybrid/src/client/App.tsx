import React from "react";
import { OverlayProvider } from "overlay-kit";
import MovieHomePage from "./pages/MovieHomePage";
import MovieDetailPage from "./pages/MovieDetailPage";
import { Route } from "./components/common/Route";

interface AppProps {
  serverData?: any;
}

function App({ serverData }: AppProps) {
  // 클라이언트에서는 window.__INITIAL_DATA__를, 서버에서는 serverData를 사용
  const data =
    typeof window === "undefined"
      ? serverData
      : (window.__INITIAL_DATA__ ?? serverData);

  const { movies = [], detail = null } = data || {};

  return (
    <OverlayProvider>
      <Route
        path="/"
        element={MovieHomePage}
        serverData={data}
      />
      <Route
        path="/detail/:movieId"
        element={MovieDetailPage}
        serverData={data}
      />
    </OverlayProvider>
  );
}

export default App;
