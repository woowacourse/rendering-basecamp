import { readFile } from "fs/promises";
import path from "path";
import { Movie, MovieDetail } from "../service/types";

function renderMovieItem(movie: Movie): string {
  const posterUrl = movie.poster_path
    ? `https://media.themoviedb.org/t/p/w440_and_h660_face${movie.poster_path}`
    : "/images/no_image.png";
  const rate = (Math.round((movie.vote_average || 0) * 10) / 10).toFixed(1);

  return `
    <li class="movie-item">
      <a href="/detail/${movie.id}" class="item">
        <img class="thumbnail" src="${posterUrl}" alt="${movie.title}" loading="lazy" />
        <div class="item-desc">
          <p class="rate">
            <img src="/images/star_empty.png" class="star" />
            <span>${rate}</span>
          </p>
          <strong>${movie.title}</strong>
        </div>
      </a>
    </li>`;
}

export async function renderHomePage(movies: Movie[]): Promise<string> {
  const templatePath = path.join(__dirname, "../../public/index.html");
  const template = await readFile(templatePath, "utf-8");

  const featuredMovie = movies[0];
  const backgroundUrl = featuredMovie?.backdrop_path
    ? `https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${featuredMovie.backdrop_path}`
    : "/images/dizzy_planet.png";
  const featuredTitle = featuredMovie?.title || "";
  const featuredRate = featuredMovie
    ? (Math.round((featuredMovie.vote_average || 0) * 10) / 10).toFixed(1)
    : "0.0";
  const featuredLink = featuredMovie ? `/detail/${featuredMovie.id}` : "#";

  const movieListHtml = movies.map(renderMovieItem).join("");

  return template
    .replace(/\{\{FEATURED_BACKGROUND\}\}/g, backgroundUrl)
    .replace(/\{\{FEATURED_TITLE\}\}/g, featuredTitle)
    .replace(/\{\{FEATURED_RATE\}\}/g, featuredRate)
    .replace(/\{\{FEATURED_LINK\}\}/g, featuredLink)
    .replace(/\{\{MOVIE_LIST\}\}/g, movieListHtml);
}

export async function renderDetailPage(
  movieDetail: MovieDetail
): Promise<string> {
  const templatePath = path.join(__dirname, "../../public/modal.html");
  const template = await readFile(templatePath, "utf-8");

  const title = movieDetail.title;
  const overview = movieDetail.overview || "";
  const genres = (movieDetail.genres || []).map((g) => g.name).join(", ");
  const rating = (
    Math.round((movieDetail.vote_average || 0) * 10) / 10
  ).toFixed(1);
  const posterUrl = movieDetail.poster_path
    ? `https://image.tmdb.org/t/p/original${movieDetail.poster_path}`
    : "/images/no_image.png";

  return template
    .replace(/\{\{MOVIE_TITLE\}\}/g, title)
    .replace(/\{\{MOVIE_POSTER\}\}/g, posterUrl)
    .replace(/\{\{MOVIE_GENRES\}\}/g, genres)
    .replace(/\{\{MOVIE_RATING\}\}/g, rating)
    .replace(/\{\{MOVIE_OVERVIEW\}\}/g, overview)
    .replace(/\{\{OG_TITLE\}\}/g, title)
    .replace(/\{\{OG_DESCRIPTION\}\}/g, overview.slice(0, 200))
    .replace(/\{\{OG_IMAGE\}\}/g, posterUrl)
    .replace(/\{\{OG_URL\}\}/g, `/detail/${movieDetail.id}`);
}
