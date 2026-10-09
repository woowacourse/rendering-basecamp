import { SITE_NAME } from "../constants/site";
import { Movie } from "../service/types";
import { renderDocument } from "./document";
import { escapeHtml } from "./escapeHtml";
import { NO_IMAGE_PATH, getTmdbImageUrl } from "./tmdbImage";

const renderFeaturedMovie = ({ title, vote_average }: Movie) => /*html*/ `
  <div class="top-rated-movie">
    <div class="rate">
      <img src="/images/star_empty.png" width="32" height="32" />
      <span class="text-2xl font-semibold text-yellow">${vote_average}</span>
    </div>
    <h1 class="text-3xl font-semibold">${escapeHtml(title)}</h1>
    <button class="primary detail">자세히 보기</button>
  </div>
`;

const renderHeader = (featuredMovie: Movie | undefined) => {
  const backgroundStyle = featuredMovie?.poster_path
    ? ` style="background-image: url(${escapeHtml(getTmdbImageUrl("w1920_and_h800_multi_faces", featuredMovie.poster_path))});"`
    : "";

  return /*html*/ `
    <header>
      <div class="background-container"${backgroundStyle}>
        <div class="overlay"></div>
        <div class="top-rated-container">
          <img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" />
          ${featuredMovie ? renderFeaturedMovie(featuredMovie) : ""}
        </div>
      </div>
    </header>
  `;
};

const renderMovieItem = ({ title, poster_path, vote_average }: Movie) => {
  const thumbnailUrl = poster_path ? getTmdbImageUrl("w500", poster_path) : NO_IMAGE_PATH;

  return /*html*/ `
    <li class="movie-item">
      <div class="item">
        <img class="thumbnail" src="${escapeHtml(thumbnailUrl)}" alt="${escapeHtml(title)}" loading="lazy" />
        <div class="item-desc">
          <p class="rate">
            <img src="/images/star_empty.png" class="star" />
            <span>${vote_average.toFixed(1)}</span>
          </p>
          <strong>${escapeHtml(title)}</strong>
        </div>
      </div>
    </li>
  `;
};

const renderMovieList = (movies: Movie[]) => /*html*/ `
  <main>
    <section class="container">
      <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
      <ul class="thumbnail-list">
        ${movies.map(renderMovieItem).join("")}
      </ul>
    </section>
  </main>
`;

const renderFooter = () => /*html*/ `
  <footer class="footer">
    <p>&copy; 우아한테크코스 All Rights Reserved.</p>
    <p><img src="/images/woowacourse_logo.png" width="180" alt="우아한테크코스" /></p>
  </footer>
`;

export const renderHomeContent = (movies: Movie[]) => /*html*/ `
  <div id="wrap">
    ${renderHeader(movies[0])}
    ${renderMovieList(movies)}
    ${renderFooter()}
  </div>
`;

export const renderHomePage = (movies: Movie[]) =>
  renderDocument({ title: SITE_NAME, body: renderHomeContent(movies) });
