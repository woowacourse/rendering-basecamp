import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import path from "path";
import { moviesApi } from "./service/tmdbApi";
import { getOGMetaTagsHTML } from "./utils/getOGMetaTags";
import { getFullUrl } from "./utils/getUrl";
import { getTopMovieHeaderHTML } from "./utils/getTopMovieHeaderHTML";

const app = express();
const PORT = 8080;

app.use(express.json());

app.get("/", async (_req: Request, res: Response) => {
  const { results: movies } = await moviesApi.getPopular();
  const topMovie = movies[0];

  const topMovieImageUrl = topMovie.poster_path
    ? `https://image.tmdb.org/t/p/original${topMovie.poster_path}`
    : "/images/no_image.png";

  const ogMetaTags = getOGMetaTagsHTML({
    title: "영화 추천 사이트",
    description: `현재 인기 영화: ${topMovie.title}. ${
      topMovie.overview || "최신 인기 영화를 확인해보세요."
    }`,
    url: getFullUrl(_req),
    image: topMovieImageUrl,
  });

  res.send(/*html*/ `
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/styles/index.css" />
    ${ogMetaTags}
  </head>
  <body>
    <div id="wrap">
      <header>${getTopMovieHeaderHTML(topMovie)}</header>
      <main>
        <section class="container">
          <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
          <ul class="thumbnail-list">
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
          </ul>
        </section>
      </main>
      <footer class="footer">
        <p>&copy; 우아한테크코스 All Rights Reserved.</p>
        <p><img src="/images/woowacourse_logo.png" width="180" alt="우아한테크코스" /></p>
      </footer>
    </div>
  </body>
</html>
        `);
});

app.get("/detail/:id", async (_req: Request, res: Response) => {
  const movieId = _req.params.id;
  const [{ results: movies }, selectedMovieDetail] = await Promise.all([
    moviesApi.getPopular(),
    moviesApi.getDetail(Number(movieId)),
  ]);

  const topMovie = movies[0];

  const imageUrl = selectedMovieDetail.poster_path
    ? `https://image.tmdb.org/t/p/original${selectedMovieDetail.poster_path}`
    : "/images/no_image.png";

  const ogMetaTags = getOGMetaTagsHTML({
    title: `${selectedMovieDetail.title} | 영화 리뷰`,
    description:
      selectedMovieDetail.overview || "영화 상세 정보를 확인해보세요.",
    url: getFullUrl(_req),
    type: "video.movie",
    image: imageUrl,
    movieReleaseDate: selectedMovieDetail.release_date,
    movieTags:
      selectedMovieDetail.genres?.map((genre) => genre.name).join(", ") || "",
  });

  res.send(/*html*/ `
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/styles/index.css" />
    <title>영화 리뷰</title>
    ${ogMetaTags}
  </head>
  <body>
    <div id="wrap">
      <header>${getTopMovieHeaderHTML(topMovie)}</header>
      <main>
        <section class="container">
          <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
          <ul class="thumbnail-list">
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
            <li class="movie-item">
              <div class="item">
                <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" loading="lazy" />
                <div class="item-desc">
                  <p class="rate">
                    <img src="/images/star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>인사이드 아웃 2</strong>
                </div>
              </div>
            </li>
          </ul>
        </section>
      </main>
      <footer class="footer">
        <p>&copy; 우아한테크코스 All Rights Reserved.</p>
        <p><img src="/images/woowacourse_logo.png" width="180" alt="우아한테크코스" /></p>
      </footer>
    </div>

    <div class="modal-background active">
      <div class="modal">
        <!-- 모달 헤더 -->
        <div class="modal-header">
          <h1 class="modal-title">인사이드 아웃 2</h1>
          <img src="/images/modal_button_close.png" width="24" height="24" class="modal-close-btn" alt="Close" />
        </div>

        <div class="modal-container">
          <img src="https://image.tmdb.org/t/p/original//pmemGuhr450DK8GiTT44mgwWCP7.jpg" alt="인사이드 아웃 2" class="modal-image" />
          <div class="modal-description">
            <!-- 영화 정보 섹션 -->
            <div class="movie-info-line">
              <span class="movie-meta">모험, 애니메이션, 코미디, 드라마, 가족</span>
              <div class="movie-rating">
                <img src="/images/star_filled.png" width="16" height="16" />
                <span class="rating-value">7.7</span>
              </div>
            </div>

            <!-- 줄거리 -->
            <div class="overview-section">
              <p class="overview-text">
                13살이 된 라일리의 행복을 위해 매일 바쁘게 머릿속 감정 컨트롤 본부를 운영하는 '기쁨', '슬픔', '버럭', '까칠', '소심'. 그러던 어느 날, 낯선 감정인 '불안', '당황', '따분', '부럽'이가 본부에 등장하고, 언제나 최악의 상황을 대비하며 제멋대로인 '불안'이와 기존 감정들은 계속 충돌한다. 결국 새로운 감정들에 의해 본부에서 쫓겨나게 된 기존 감정들은 다시 본부로 돌아가기 위해 위험천만한 모험을 시작하는데…
              </p>
            </div>

            <!-- 내 별점 섹션 -->
            <div class="my-rating-section">
              <div class="rating-header">
                <span class="rating-label">내 별점</span>
                <div class="star-rating">
                  <img src="/images/star_filled.png" width="24" height="24" alt="Star 1" />
                  <img src="/images/star_filled.png" width="24" height="24" alt="Star 2" />
                  <img src="/images/star_filled.png" width="24" height="24" alt="Star 3" />
                  <img src="/images/star_filled.png" width="24" height="24" alt="Star 4" />
                  <img src="/images/star_empty.png" width="24" height="24" alt="Star 5" />
                  <span class="rating-text">8 재미있어요</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
        `);
});

// public 폴더 속 정적 파일을 웹에서 접근할 수 있도록 만든다.
app.use(express.static(path.join(__dirname, "../public")));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
