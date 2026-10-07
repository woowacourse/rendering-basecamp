import { Movie } from "../service/types";
import { escapeHtml } from "../utils/escapeHtml";
import { getBannerUrl } from "../utils/imageUrl";

export const renderHeader = (featuredMovie: Movie) => /*html*/ `
  <header>
    <div class="background-container" style="background-image: url(${escapeHtml(getBannerUrl(featuredMovie.poster_path))});">
      <div class="overlay"></div>
      <div class="top-rated-container">
        <a href="/">
          <img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" />
        </a>
        <div class="top-rated-movie">
          <div class="rate">
            <img src="/images/star_empty.png" width="32" height="32" />
            <span class="text-2xl font-semibold text-yellow">${featuredMovie.vote_average}</span>
          </div>
          <h1 class="text-3xl font-semibold">${escapeHtml(featuredMovie.title)}</h1>
          <a href="/detail/${featuredMovie.id}">
            <button class="primary detail">자세히 보기</button>
          </a>
        </div>
      </div>
    </div>
  </header>
`;
