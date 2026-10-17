import type { ComponentProps } from "react";
import { OverlayProvider } from "overlay-kit";
import MovieHomePage from "./pages/MovieHomePage";
import MovieDetailPage from "./pages/MovieDetailPage";

export type Page =
  | { name: "home"; props: ComponentProps<typeof MovieHomePage> }
  | { name: "detail"; props: ComponentProps<typeof MovieDetailPage> };

const renderPage = (page: Page) => {
  switch (page.name) {
    case "home":
      return <MovieHomePage {...page.props} />;
    case "detail":
      return <MovieDetailPage {...page.props} />;
  }
};

function App({ page }: { page: Page }) {
  return <OverlayProvider>{renderPage(page)}</OverlayProvider>;
}

export default App;
