import { Request, Response } from "express";
import { buildHtml } from "../utils/buildHtml";
import { moviesApi } from "../service/tmdbApi";

export async function indexPage(_req: Request, res: Response) {
  try {
    const data = await moviesApi.getPopular();
    console.log(data);
    const movies = data.results.slice(0, 12);
    const topMovie = movies[0];

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
                <span class="text-2xl font-semibold text-yellow">${topMovie.vote_average.toFixed(
                  1
                )}</span>
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
        </li>`
      )
      .join("");

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
    `;

    const html = buildHtml({
      title: "영화 리뷰",
      body,
    });

    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send("서버 오류");
  }
}
