import { Movie, MovieDetail } from "../service/types";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "../constants/site";
import { escapeHtml } from "../utils/escapeHtml";
import { footer } from "./footer";
import { header } from "./header";
import { layout } from "./layout";
import { modal } from "./modal";
import { movieList } from "./movieList";

const homeBody = (movies: Movie[]) => /*html*/ `
    <div id="wrap">${header(movies[0])}${movieList(movies)}${footer()}
    </div>`;

export const homePage = (movies: Movie[]) =>
  layout(
    { title: SITE_NAME, description: SITE_DESCRIPTION, url: SITE_URL },
    homeBody(movies)
  );

export const detailPage = (movies: Movie[], movie: MovieDetail) =>
  layout(
    {
      title: `${movie.title} | ${SITE_NAME}`,
      description: movie.overview || `${movie.title} 상세 정보`,
      url: `${SITE_URL}/detail/${movie.id}`,
      image: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : undefined,
    },
    homeBody(movies) + modal(movie)
  );

export const errorPage = (status: number, message: string) =>
  layout(
    { title: `${status} | ${SITE_NAME}`, description: message, url: SITE_URL },
    /*html*/ `
    <div id="wrap">
      <main>
        <section class="container">
          <h2 class="text-2xl font-bold mb-64">${escapeHtml(message)}</h2>
          <a href="/">홈으로 돌아가기</a>
        </section>
      </main>${footer()}
    </div>`
  );
