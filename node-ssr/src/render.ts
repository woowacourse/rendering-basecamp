import { Movie, MovieDetail } from "./service/types";

const renderMovieList = (movies: Movie[]) => {
  const movieItems = movies
    .map(
      (movie) => /* html */ `
        <li class="movie-item">
          <a href="/detail/${movie.id}">
            <div class="item">
              <img
                class="thumbnail"
                src="${
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "/images/no_image.png"
                }"
                alt="${movie.title}"
                loading="lazy"
              />
              <div class="item-desc">
                <p class="rate">
                  <img src="/images/star_empty.png" class="star" alt="" />
                  <span>${movie.vote_average.toFixed(1)}</span>
                </p>
                <strong>${movie.title}</strong>
              </div>
            </div>
          </a>
        </li>
      `,
    )
    .join("");

  return /* html */ `
    <main>
      <section class="container">
        <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
        <ul class="thumbnail-list">
          ${movieItems}
        </ul>
      </section>
    </main>
  `;
};

export const renderHome = (movies: Movie[]) => {
  const featuredMovie = movies[0];

  return /* html */ `
    <div id="wrap">
      <header>
        <div
          class="background-container"
          style="background-image: url(${
            featuredMovie.poster_path
              ? `https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${featuredMovie.poster_path}`
              : "/images/no_image.png"
          })"
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
                  alt=""
                />
                <span class="text-2xl font-semibold text-yellow">
                  ${featuredMovie.vote_average.toFixed(1)}
                </span>
              </div>
              <h1 class="text-3xl font-semibold">${featuredMovie.title}</h1>
              <button class="primary detail">자세히 보기</button>
            </div>
          </div>
        </div>
      </header>

      ${renderMovieList(movies)}

      <footer class="footer">
        <p>&copy; 우아한테크코스 All Rights Reserved.</p>
        <p>
          <img
            src="/images/woowacourse_logo.png"
            width="180"
            alt="우아한테크코스"
          />
        </p>
      </footer>
    </div>
  `;
};

export const renderModal = (movie: MovieDetail) => {
  const genreNames = movie.genres.map((genre) => genre.name).join(", ");
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
    : "/images/no_image.png";

  return /* html */ `
    <div class="modal-background active">
      <div class="modal">
        <div class="modal-header">
          <h1 class="modal-title">${movie.title}</h1>
          <a href="/">
            <img
              src="/images/modal_button_close.png"
              width="24"
              height="24"
              class="modal-close-btn"
              alt="닫기"
            />
          </a>
        </div>

        <div class="modal-container">
          <img src="${imageUrl}" alt="${movie.title}" class="modal-image" />
          <div class="modal-description">
            <div class="movie-info-line">
              <span class="movie-meta">${genreNames}</span>
              <div class="movie-rating">
                <img
                  src="/images/star_filled.png"
                  width="16"
                  height="16"
                  alt=""
                />
                <span class="rating-value">${movie.vote_average.toFixed(1)}</span>
              </div>
            </div>

            <div class="overview-section">
              <p class="overview-text">
                ${movie.overview || "줄거리 정보가 없습니다."}
              </p>
            </div>

            <div class="my-rating-section">
              <div class="rating-header">
                <span class="rating-label">내 별점</span>
                <div class="star-rating">
                  ${Array.from(
                    { length: 5 },
                    (_, index) => /* html */ `
                      <button>
                        <img
                          src="/images/star_empty.png"
                          width="24"
                          height="24"
                          alt="Star ${index + 1}"
                        />
                      </button>
                    `,
                  ).join("")}
                  <span class="rating-text">0 별점을 남겨주세요</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

export const renderOpenGraph = ({
  type,
  title,
  description,
  image,
}: {
  type?: "website";
  title: string;
  description: string;
  image?: string;
}) => /* html */ `
  ${type ? `<meta property="og:type" content="${type}" />` : ""}
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  ${image ? `<meta property="og:image" content="${image}" />` : ""}
`;

export const renderHtml = (
  title: string,
  body: string,
  head = "",
) => /* html */ `
  <!DOCTYPE html>
  <html lang="ko">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="stylesheet" href="/styles/index.css" />
      <title>${title}</title>
      ${head}
    </head>
    <body>
      ${body}
    </body>
  </html>
`;
