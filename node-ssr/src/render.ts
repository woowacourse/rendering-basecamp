import type { Movie } from "./service/types";

// 제목에 <, & 같은 문자가 있어도 HTML 코드로 해석하지 않고 텍스트로 표시되도록 한다.
// 보안을 위한
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderHomePage(movies: Movie[]): string {
  const firstMovie = movies[0];

  const bannerPosterUrl = firstMovie?.poster_path
    ? `https://image.tmdb.org/t/p/w500${firstMovie.poster_path}`
    : "/images/no_image.png";

  const banner = firstMovie
    ? `
    <header>
      <div
        class="background-container"
        style="background-image: url('${escapeHtml(
          encodeURI(bannerPosterUrl),
        )}');"
      >
        <div class="overlay"></div>
        <div class="top-rated-container">
          <img
            src="/images/logo.png"
            width="117"
            height="20"
            class="logo"
            alt="MovieLogo"
          />
          <div class="top-rated-movie">
            <div class="rate">
              <img
                src="/images/star_empty.png"
                width="32"
                height="32"
                alt="평점"
              />
              <span class="text-2xl font-semibold text-yellow">
                ${firstMovie.vote_average.toFixed(1)}
              </span>
            </div>
            <h1 class="text-3xl font-semibold">
              ${escapeHtml(firstMovie.title)}
            </h1>
            <a class="primary detail" href="/detail/${firstMovie.id}">
              자세히 보기
            </a>
          </div>
        </div>
      </div>
    </header>
  `
    : "";

  const cards = movies
    .map((movie) => {
      const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "/images/no_image.png";

      return `
        <li class="movie-item">
          <a class="item" href="/detail/${movie.id}">
            <img
              class="thumbnail"
              src="${escapeHtml(posterUrl)}"
              alt="${escapeHtml(movie.title)}"
              loading="lazy"
            />
            <div class="item-desc">
              <p class="rate">
                <img
                  src="/images/star_empty.png"
                  class="star"
                  alt="평점"
                />
                <span>${movie.vote_average.toFixed(1)}</span>
              </p>
              <strong>${escapeHtml(movie.title)}</strong>
            </div>
          </a>
        </li>
      `;
    })
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/styles/index.css" />
        <title>영화 리뷰</title>
      </head>
      <body>
        <div id="wrap">
          ${banner}
          <main>
            <section class="container">
              <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
              ${
                movies.length > 0
                  ? `<ul class="thumbnail-list">${cards}</ul>`
                  : "<p>인기 영화가 없습니다.</p>"
              }
            </section>
          </main>
        </div>
      </body>
    </html>
  `;
}
