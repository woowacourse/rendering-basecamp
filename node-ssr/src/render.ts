import type { Movie, MovieDetail } from "./service/types";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function imageUrl(
  filePath: string | null,
  size: "w500" | "w1280" = "w500",
): string {
  if (!filePath || !/^\/[a-zA-Z0-9._-]+$/.test(filePath)) {
    return "/images/no_image.png";
  }

  return `https://image.tmdb.org/t/p/${size}${filePath}`;
}

function renderPage(
  title: string,
  body: string,
  extraHead: string = "",
): string {
  return `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8">
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        >
        <title>${escapeHtml(title)}</title>
        <link rel="stylesheet" href="/styles/index.css">
        ${extraHead}
      </head>
      <body>
        <div id="wrap">
          ${body}

          <footer class="footer">
            <p>&copy; 우아한테크코스 All Rights Reserved.</p>
            <img
              src="/images/woowacourse_logo.png"
              width="180"
              alt="우아한테크코스"
            >
          </footer>
        </div>
      </body>
    </html>
  `;
}

export function renderHome(movies: Movie[]): string {
  const featured = movies[0];

  const banner = featured
    ? `
    <header>
      <div
        class="background-container"
        style="background-image: url('${imageUrl(
          featured.backdrop_path,
          "w1280",
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
          >

          <div class="top-rated-movie">
            <p class="rate">
              ${featured.vote_average.toFixed(1)}
            </p>

            <h1 class="text-3xl font-semibold">
              ${escapeHtml(featured.title)}
            </h1>

            <a href="/detail/${featured.id}">
              자세히 보기
            </a>
          </div>
        </div>
      </div>
    </header>
  `
    : "";

  const cards = movies
    .map(
      (movie) => `
    <li class="movie-item">
      <a class="item" href="/detail/${movie.id}">
        <img
          class="thumbnail"
          src="${escapeHtml(imageUrl(movie.poster_path))}"
          alt="${escapeHtml(movie.title)}"
          width="200"
          height="300"
        >

        <div class="item-desc">
          <p class="rate">
            <img
              src="/images/star_empty.png"
              class="star"
              alt=""
            >
            <span>${movie.vote_average.toFixed(1)}</span>
          </p>

          <strong>${escapeHtml(movie.title)}</strong>
        </div>
      </a>
    </li>
  `,
    )
    .join("");

  return renderPage(
    "영화 리뷰",
    `
    ${banner}

    <main>
      <section class="container">
        <h2 class="text-2xl font-bold mb-64">
          지금 인기 있는 영화
        </h2>

        <ul class="thumbnail-list">
          ${cards}
        </ul>

        ${movies.length === 0 ? "<p>표시할 영화가 없습니다.</p>" : ""}
      </section>
    </main>
  `,
  );
}

export function renderDetail(
  movie: MovieDetail,
  publicBaseUrl: string,
): string {
  const poster = imageUrl(movie.poster_path);

  const pageUrl = new URL(`/detail/${movie.id}`, publicBaseUrl).href;

  const ogImage = new URL(poster, publicBaseUrl).href;

  const overview = movie.overview || "등록된 줄거리가 없습니다.";

  const genres = movie.genres.map((genre) => genre.name).join(", ");

  const ogTags = `
    <meta property="og:type" content="website">

    <meta
      property="og:title"
      content="${escapeHtml(movie.title)}"
    >

    <meta
      property="og:description"
      content="${escapeHtml(overview.slice(0, 150))}"
    >

    <meta
      property="og:image"
      content="${escapeHtml(ogImage)}"
    >

    <meta
      property="og:url"
      content="${escapeHtml(pageUrl)}"
    >
  `;

  const body = `
    <div class="modal-background active">
      <div class="modal">
        <div class="modal-header">
          <h1 class="modal-title">
            ${escapeHtml(movie.title)}
          </h1>

          <a href="/">닫기</a>
        </div>

        <div class="modal-container">
          <img
            class="modal-image"
            src="${escapeHtml(poster)}"
            alt="${escapeHtml(movie.title)}"
          >

          <div class="modal-description">
            <div class="movie-info-line">
              <span class="movie-meta">
                ${escapeHtml(genres)}
              </span>

              <span class="rating-value">
                ${movie.vote_average.toFixed(1)}
              </span>
            </div>

            <div class="overview-section">
              <p class="overview-text">
                ${escapeHtml(overview)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  return renderPage(`${movie.title} | 영화 리뷰`, body, ogTags);
}
