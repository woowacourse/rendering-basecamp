import React from "react";
import { OverlayProvider } from "overlay-kit";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MovieHomePage from "./pages/MovieHomePage";
import MovieDetailPage from "./pages/MovieDetailPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MovieHomePage />,
  },
  {
    path: "/detail/:movieId",
    element: <MovieDetailPage />,
  },
]);

function App() {
  return (
    <OverlayProvider>
      <RouterProvider router={router} />
    </OverlayProvider>
  );
}

export default App;
