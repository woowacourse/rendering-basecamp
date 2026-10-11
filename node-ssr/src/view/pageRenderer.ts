import fs from "fs";
import path from "path";
import type { Movie, MovieDetailResponse } from "../service/types";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
const PUBLIC_DIRECTORY = path.join(__dirname, "../../public");
const pageTemplate = fs.readFileSync(
  path.join(PUBLIC_DIRECTORY, "index.html"),
  "utf-8"
);
const modalTemplate = fs.readFileSync(
  path.join(PUBLIC_DIRECTORY, "modal.html"),
  "utf-8"
);

interface PageOptions {
  pageTitle: string;
  pageDescription: string;
  openGraphTags?: string;
  movieDetailModal?: string;
}

const escapeHtml = (value: string | number): string => {
  const entities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };

  return String(value).replace(/[&<>"']/g, (character) => entities[character]);
};

const fillTemplate = (
  template: string,
  replacements: Record<string, string>
): string =>
  Object.entries(replacements).reduce(
    (html, [key, value]) => html.split(`{{${key}}}`).join(value),
    template
  );

const createImageUrl = (
  imagePath: string | null,
  size: string
): string =>
  imagePath ? `${IMAGE_BASE_URL}/${size}${imagePath}` : "/images/no_image.png";

const renderMovieItem = (movie: Movie): string => {
  const title = escapeHtml(movie.title);
  const posterUrl = escapeHtml(createImageUrl(movie.poster_path, "w500"));

  return /* html */ `
    <li class="movie-item" data-index="${movie.id}">
      <a href="/detail/${movie.id}">
        <div class="item">
          <img
            class="thumbnail"
            src="${posterUrl}"
            alt="${title}"
            loading="lazy"
          />
          <div class="item-desc">
            <p class="rate">
              <img src="/images/star_empty.png" class="star" alt="" />
              <span>${movie.vote_average.toFixed(1)}</span>
            </p>
            <strong>${title}</strong>
          </div>
        </div>
      </a>
    </li>
  `;
};

const renderOpenGraphTags = (movie: MovieDetailResponse): string => {
  const imagePath = movie.poster_path ?? movie.backdrop_path;
  const imageTag = imagePath
    ? `<meta property="og:image" content="${escapeHtml(
        createImageUrl(imagePath, "w500")
      )}" />`
    : "";

  return /* html */ `
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeHtml(movie.title)}" />
    <meta property="og:description" content="${escapeHtml(
      movie.overview || `${movie.title}의 상세 정보를 확인해 보세요.`
    )}" />
    ${imageTag}
  `;
};

const renderMovieDetailModal = (movie: MovieDetailResponse): string =>
  fillTemplate(modalTemplate, {
    MOVIE_TITLE: escapeHtml(movie.title),
    MOVIE_POSTER_URL: escapeHtml(
      createImageUrl(movie.poster_path, "original")
    ),
    MOVIE_GENRES: escapeHtml(
      movie.genres.map((genre) => genre.name).join(", ") ||
        "장르 정보가 없습니다."
    ),
    MOVIE_VOTE_AVERAGE: movie.vote_average.toFixed(1),
    MOVIE_OVERVIEW: escapeHtml(movie.overview || "줄거리 정보가 없습니다."),
  });

const renderMoviePage = (movies: Movie[], options: PageOptions): string => {
  const featuredMovie = movies[0];

  if (!featuredMovie) {
    throw new Error("인기 영화 목록이 비어 있습니다.");
  }

  const featuredBackground = createImageUrl(
    featuredMovie.backdrop_path ?? featuredMovie.poster_path,
    "w1920_and_h800_multi_faces"
  );

  return fillTemplate(pageTemplate, {
    PAGE_TITLE: escapeHtml(options.pageTitle),
    PAGE_DESCRIPTION: escapeHtml(options.pageDescription),
    OPEN_GRAPH_TAGS: options.openGraphTags ?? "",
    FEATURED_BACKGROUND_URL: escapeHtml(featuredBackground),
    FEATURED_VOTE_AVERAGE: featuredMovie.vote_average.toFixed(1),
    FEATURED_TITLE: escapeHtml(featuredMovie.title),
    FEATURED_ID: String(featuredMovie.id),
    MOVIE_LIST: movies.map(renderMovieItem).join(""),
    MOVIE_DETAIL_MODAL: options.movieDetailModal ?? "",
  });
};

export const renderHomePage = (movies: Movie[]): string =>
  renderMoviePage(movies, {
    pageTitle: "영화 리뷰",
    pageDescription: "현재 인기 있는 영화 목록을 확인해 보세요.",
  });

export const renderDetailPage = (
  movies: Movie[],
  movie: MovieDetailResponse
): string =>
  renderMoviePage(movies, {
    pageTitle: `${movie.title} | 영화 리뷰`,
    pageDescription:
      movie.overview || `${movie.title}의 상세 정보를 확인해 보세요.`,
    openGraphTags: renderOpenGraphTags(movie),
    movieDetailModal: renderMovieDetailModal(movie),
  });
