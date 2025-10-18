import MovieHomePage, {
  getServerData as homeGetServerData,
} from "./pages/MovieHomePage";
import MovieDetailPage, {
  getServerData as detailGetServerData,
} from "./pages/MovieDetailPage";
import NotFoundPage from "./pages/NotFoundPage";

export const routes = [
  {
    path: "/",
    component: MovieHomePage,
    getServerData: homeGetServerData,
  },
  {
    path: "/detail/:movieId",
    component: MovieDetailPage,
    getServerData: detailGetServerData,
  },
  { path: "/404", component: NotFoundPage },
];
