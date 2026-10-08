import { Movie } from "../service/types";
import { movieItem } from "./movieItem";

export const movieList = (movies: Movie[]) => /*html*/ `
      <main>
        <section class="container">
          <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
          <ul class="thumbnail-list">${movies.map(movieItem).join("")}
          </ul>
        </section>
      </main>`;
