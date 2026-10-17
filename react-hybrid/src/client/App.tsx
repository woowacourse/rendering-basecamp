import type { ComponentProps } from "react";
import { OverlayProvider } from "overlay-kit";
import MovieHomePage from "./pages/MovieHomePage";
import MovieDetailPage from "./pages/MovieDetailPage";
import ErrorPage from "./pages/ErrorPage";

export type Page =
  | { name: "home"; props: ComponentProps<typeof MovieHomePage> }
  | { name: "detail"; props: ComponentProps<typeof MovieDetailPage> }
  | { name: "error"; props: ComponentProps<typeof ErrorPage> };

const renderPage = (page: Page) => {
  switch (page.name) {
    case "home":
      return <MovieHomePage {...page.props} />;
    case "detail":
      return <MovieDetailPage {...page.props} />;
    case "error":
      return <ErrorPage {...page.props} />;
  }
};

function App({ page }: { page: Page }) {
  return <OverlayProvider>{renderPage(page)}</OverlayProvider>;
}

export default App;
