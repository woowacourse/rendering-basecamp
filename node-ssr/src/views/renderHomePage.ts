import {Movie} from '../service/types';
import escapeHtml from '../utils/escapeHtml';
import {IMAGE_BASE_URL, posterUrl, renderDocument} from './renderDocument';

export const renderHomePage = (movies: Movie[]): string =>
	renderDocument(renderPopularMovies(movies));

export const renderPopularMovies = (movies: Movie[]): string => `
  <div id="wrap">
    <header>${renderHero(movies[0])}</header>
    <main>
      <section class="container">
        <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
        <ul class="thumbnail-list">${renderMovieItems(movies)}</ul>
      </section>
    </main>
    <footer class="footer">
      <p>&copy; 우아한테크코스 All Rights Reserved.</p>
      <p><img src="/images/woowacourse_logo.png" width="180" alt="우아한테크코스" /></p>
    </footer>
  </div>`;

const renderHero = (movie: Movie | undefined): string => {
	if (!movie) {
		return '<div class="background-container"><p>인기 영화를 불러오지 못했습니다.</p></div>';
	}

	const backdrop = movie.backdrop_path
		? `${IMAGE_BASE_URL}/w1920_and_h800_multi_faces${movie.backdrop_path}`
		: '/images/dizzy_planet.png';

	return `
      <div class="background-container" style="background-image: url('${escapeHtml(backdrop)}');">
        <div class="overlay"></div>
        <div class="top-rated-container">
          <img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" />
          <div class="top-rated-movie">
            <div class="rate">
              <img src="/images/star_empty.png" width="32" height="32" alt="별점" />
              <span class="text-2xl font-semibold text-yellow">${movie.vote_average.toFixed(1)}</span>
            </div>
            <h1 class="text-3xl font-semibold">${escapeHtml(movie.title)}</h1>
            <a class="primary detail" href="/detail/${movie.id}">자세히 보기</a>
          </div>
        </div>
      </div>`;
};

const renderMovieItems = (movies: Movie[]): string =>
	movies
	.map(
		(movie) => `
        <li class="movie-item">
          <a class="item" href="/detail/${movie.id}">
            <img class="thumbnail" src="${escapeHtml(posterUrl(movie.poster_path, 'w440_and_h660_face'))}" alt="${escapeHtml(movie.title)}" loading="lazy" />
            <div class="item-desc">
              <p class="rate">
                <img src="/images/star_empty.png" class="star" alt="별점" />
                <span>${movie.vote_average.toFixed(1)}</span>
              </p>
              <strong>${escapeHtml(movie.title)}</strong>
            </div>
          </a>
        </li>`,
	)
	.join('');
