import dotenv from "dotenv";
dotenv.config();

import express, { type Request, type Response } from "express";
import path from "path";
import { moviesApi } from "./service/tmdbApi";

const metaTemplate = ({
  title,
  description,
  image,
  pageUrl,
  siteName,
}: {
  title: string;
  description: string;
  image: Record<string, string>;
  pageUrl: string;
  siteName: string;
}) => `
    <title>${title}</title>
    <meta charset="UTF-8" />
    <meta name='description' content='${description}' />
    <meta name='viewport' content='width=device-width, initial-scale=1' />
    <link rel='icon' href='/favicon.ico' />
    ${pageUrl && `<link rel='canonical' href='${pageUrl}' />`}

    <meta property='og:locale' content='ko_KR' />
    <meta property='og:site_name' content='${siteName}' />
    <meta property='og:type' content='website' />
    <meta property='og:title' content='${title}' />
    <meta property='og:description' content='${description}' />
    <meta property='og:url' content='${pageUrl}' />
    ${image.url && `<meta property='og:image' content='${image.url}' />`}
    ${image.alt && `<meta property='og:image:alt' content='${image.alt}' />`}

    <meta name='twitter:card' content='summary_large_image' />
    <meta name='twitter:title' content='${title}' />
    <meta name='twitter:description' content='${description}' />
    ${image.url && `<meta property='twitter:image' content='${image.url}' />`}
    ${
      image.alt &&
      `<meta property='twitter:image:alt' content='${image.alt}' />`
    }
`;

const app = express();
const PORT = 8080;

app.use(express.json());

app.get("/", async (_req: Request, res: Response) => {
  const popularMoviesResponse = await moviesApi.getPopular();
  const popularMovies = Array.isArray(popularMoviesResponse?.results)
    ? popularMoviesResponse.results
    : [];
  const bannerMoive = popularMovies[0];

  const metaTags = metaTemplate({
    title: "세오가 추천하는 인기 영화",
    description: "지금 인기 있는 영화 정보를 확인해보세요.",
    image: {
      url: bannerMoive.poster_path
        ? `https://image.tmdb.org/t/p/original${bannerMoive.poster_path}`
        : "/images/no_image.png",
      alt: bannerMoive.title,
    },
    pageUrl: "https://rendering-basecamp-production-4152.up.railway.app/",
    siteName: "세오가 추천하는 인기 영화",
  });

  const movieItemList = `
    <ul class="thumbnail-list">
    ${popularMovies
      .map(
        (movie) => `
      <li class="movie-item">
        <div class="item">
          <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face${movie.poster_path}" alt="${movie.title}" loading="lazy" />
          <div class="item-desc">
            <p class="rate">
              <img src="/images/star_empty.png" class="star" />
              <span>${movie.vote_average}</span>
            </p>
            <strong>${movie.title}</strong>
          </div>
        </div>
      </li>
    `
      )
      .join("")}
    </ul>
  `;

  res.send(/*html*/ `
    <!DOCTYPE html>
<html lang="ko">
  <head>
    ${metaTags}
    <link rel="stylesheet" href="/styles/index.css" />
  </head>
  <body>
    <div id="wrap">
      <header>
        <div class="background-container" style="background-image: url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${bannerMoive.poster_path});">
          <div class="overlay"></div>
          <div class="top-rated-container">
            <img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" />
            <div class="top-rated-movie">
              <div class="rate">
                <img src="/images/star_empty.png" width="32" height="32" />
                <span class="text-2xl font-semibold text-yellow">${bannerMoive.vote_average}</span>
              </div>
              <h1 class="text-3xl font-semibold">${bannerMoive.title}</h1>
              <button class="primary detail">자세히 보기</button>
            </div>
          </div>
        </div>
      </header>
      <main>
        <section class="container">
          <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
          ${movieItemList}
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

// public 폴더 속 정적 파일을 웹에서 접근할 수 있도록 만든다.
app.use(express.static(path.join(__dirname, "../public")));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
