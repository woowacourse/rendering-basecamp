import { Movie } from "../service/types";
import { renderFooter } from "./Footer";
import { renderHeader } from "./Header";
import { renderMovieList } from "./MovieList";

export const renderMovieHomePage = (movies: Movie[]) => /*html*/ `
  <div id="wrap">
    ${renderHeader(movies[0])}
    ${renderMovieList(movies)}
    ${renderFooter()}
  </div>
`;
