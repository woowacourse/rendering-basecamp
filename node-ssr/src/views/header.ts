import { Movie } from "../service/types";
import { escapeHtml } from "../utils/escapeHtml";
import { hero } from "./hero";

export const header = (featuredMovie: Movie) => /*html*/ `
      <header>
        <div class="background-container" style="background-image: url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${escapeHtml(featuredMovie.poster_path ?? "")});">
          <div class="overlay"></div>
          <div class="top-rated-container">
            <img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" />${hero(featuredMovie)}
          </div>
        </div>
      </header>`;
