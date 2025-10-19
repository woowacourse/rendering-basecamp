import { Request, Response } from "express";
import { moviesApi } from "../service/tmdbApi";
import { buildHtml } from "../utils/buildHtml";

export async function detailPage(req: Request, res: Response) {
  try {
    const popularData = await moviesApi.getPopular();
    const movies = popularData.results.slice(0, 12);
    const topMovie = movies[0];
    const movieId = Number(req.params.id);
    const movie = await moviesApi.getDetail(movieId);

    const protocol = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers.host;
    const fullUrl = `${protocol}://${host}${req.originalUrl}`;
    const posterUrl = `https://image.tmdb.org/t/p/original${movie.poster_path}`;
    const genres = movie.genres.map((g) => g.name).join(", ");

    const meta = `
      <meta property="og:title" content="${movie.title}" />
      <meta property="og:description" content="${
        movie.overview?.slice(0, 100) || "영화 정보"
      }" />
      <meta property="og:image" content="${posterUrl}" />
      <meta property="og:type" content="video.movie" />
      <meta property="og:url" content="${fullUrl}" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${movie.title}" />
      <meta name="twitter:description" content="${
        movie.overview?.slice(0, 100) || "영화 정보"
      }" />
      <meta name="twitter:image" content="${posterUrl}" />
    `;

    const headerHTML = `
      <header>
        <div class="background-container"
             style="background-image: url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/${
               topMovie.backdrop_path
             });">
          <div class="overlay"></div>
          <div class="top-rated-container">
            <img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" />
            <div class="top-rated-movie">
              <div class="rate">
                <img src="/images/star_empty.png" width="32" height="32" />
                <span class="text-2xl font-semibold text-yellow">
                  ${topMovie.vote_average.toFixed(1)}
                </span>
              </div>
              <h1 class="text-3xl font-semibold">${topMovie.title}</h1>
              <a href="/detail/${topMovie.id}">
                <button class="primary detail">자세히 보기</button>
              </a>
            </div>
          </div>
        </div>
      </header>
    `;

    const movieListHTML = movies
      .map(
        (m) => `
          <li class="movie-item">
            <div class="item">
              <a href="/detail/${m.id}">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/${
                  m.poster_path
                }" alt="${m.title}" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>${m.vote_average.toFixed(1)}</span>
                  </p>
                  <strong>${m.title}</strong>
                </div>
              </a>
            </div>
          </li>
        `
      )
      .join("");

    const modalHTML = `
      <div class="modal-background active">
        <div class="modal">
          <div class="modal-header">
            <h1 class="modal-title">${movie.title}</h1>
            <a href="/"><img src="/images/modal_button_close.png" width="24" height="24" class="modal-close-btn" alt="Close" /></a>
          </div>
          <div class="modal-container">
            <img src="${posterUrl}" alt="${movie.title}" class="modal-image" />
            <div class="modal-description">
              <div class="movie-info-line">
                <span class="movie-meta">${genres}</span>
                <div class="movie-rating">
                  <img src="/images/star_filled.png" width="16" height="16" />
                  <span class="rating-value">${movie.vote_average.toFixed(
                    1
                  )}</span>
                </div>
              </div>
              <div class="overview-section">
                <p class="overview-text">${
                  movie.overview || "줄거리 정보가 없습니다."
                }</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const body = `
      <div id="wrap">
        ${headerHTML}
        <main>
          <section class="container">
            <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
            <ul class="thumbnail-list">${movieListHTML}</ul>
          </section>
        </main>
        <footer class="footer">
          <p>&copy; 우아한테크코스 All Rights Reserved.</p>
          <p><img src="/images/woowacourse_logo.png" width="180" alt="우아한테크코스" /></p>
        </footer>
      </div>
      ${modalHTML}
    `;

    const html = buildHtml({
      title: movie.title,
      meta,
      body,
    });

    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send("상세 페이지 오류");
  }
}
