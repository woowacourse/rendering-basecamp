import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import path from "path";
import { Movie } from "./service/types";
import { moviesApi } from "./service/tmdbApi";

const app = express();
const PORT = 8080;

app.use(express.json());

// public 폴더 속 정적 파일을 웹에서 접근할 수 있도록 만든다.
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", async (_req: Request, res: Response) => {
  try {
    const data = await moviesApi.getPopular();

    if (!data?.results || !Array.isArray(data.results)) {
      throw new Error("TMDB 응답이 예상과 다릅니다.");
    }

    const movieList = data.results
      .map(
        (m: Movie) => `
        <li>
          <a href="/detail/${m.id}">
            <img src="https://image.tmdb.org/t/p/w200${m.poster_path}" alt="${
          m.title
        }" />
            <p>${m.title}</p>
            <p>⭐ ${m.vote_average.toFixed(1)}</p>
          </a>
        </li>`
      )
      .join("");

    res.send(`
      <!DOCTYPE html>
      <html lang="ko">
        <head>
          <meta charset="UTF-8" />
          <title>영화 리뷰</title>
        </head>
        <body>
          <h1>인기 영화</h1>
          <ul>${movieList}</ul>
        </body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send("서버 오류가 발생했습니다.");
  }
});

app.get("/detail/:id", async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const movie = await moviesApi.getDetail(Number(id));

  const banner = `https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${movie.backdrop_path}`;
  const posterOriginal = `https://image.tmdb.org/t/p/original${movie.poster_path}`;
  const genres = movie.genres.map((g) => g.name).join(", ");
  const rating = movie.vote_average.toFixed(1);
  const overview = movie.overview || "줄거리 정보가 없습니다.";

  res.send(`
      <!DOCTYPE html>
      <html lang="ko">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${movie.title} | 영화 리뷰</title>

          <meta property="og:title" content="${movie.title}" />
          <meta property="og:description" content="${overview.slice(
            0,
            100
          )}..." />
          <meta property="og:image" content="${posterOriginal}" />
          <meta property="og:type" content="website" />

          <link rel="stylesheet" href="/styles/index.css" />
        </head>
        <body>
          <div id="wrap">
            <header>
              <div class="background-container" style="background-image: url(${banner});">
                <div class="overlay"></div>
                <div class="top-rated-container">
                  <img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" />
                  <div class="top-rated-movie">
                    <div class="rate">
                      <img src="/images/star_empty.png" width="32" height="32" />
                      <span class="text-2xl font-semibold text-yellow">${rating}</span>
                    </div>
                    <h1 class="text-3xl font-semibold">${movie.title}</h1>
                    <a href="/"><button class="primary detail">목록으로 돌아가기</button></a>
                  </div>
                </div>
              </div>
            </header>
            
            <main>
              <section class="container">
                <div class="modal-background active">
                  <div class="modal">
                    <!-- 모달 헤더 -->
                    <div class="modal-header">
                      <h1 class="modal-title">${movie.title}</h1>
                      <img src="/images/modal_button_close.png" width="24" height="24" class="modal-close-btn" alt="Close" />
                    </div>

                    <div class="modal-container">
                      <img src="${posterOriginal}" alt="${
    movie.title
  }" class="modal-image" />
                      <div class="modal-description">
                        <!-- 영화 정보 섹션 -->
                        <div class="movie-info-line">
                          <span class="movie-meta">${genres}</span>
                          <div class="movie-rating">
                            <img src="/images/star_filled.png" width="16" height="16" />
                            <span class="rating-value">${rating}</span>
                          </div>
                        </div>

                        <!-- 줄거리 -->
                        <div class="overview-section">
                          <p class="overview-text">${overview}</p>
                        </div>

                        <!-- 내 별점 (UI용, 실제 데이터 X) -->
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

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
