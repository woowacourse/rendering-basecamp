import { Movie } from "../service/types";
import { escapeHtml } from "../utils/escapeHtml";

export const hero = (movie: Movie) => /*html*/ `
            <div class="top-rated-movie">
              <div class="rate">
                <img src="/images/star_empty.png" width="32" height="32" />
                <span class="text-2xl font-semibold text-yellow">${escapeHtml(movie.vote_average)}</span>
              </div>
              <h1 class="text-3xl font-semibold">${escapeHtml(movie.title)}</h1>
              <button class="primary detail">자세히 보기</button>
            </div>`;
