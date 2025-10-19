import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import path from 'path';
import { moviesApi } from './service/tmdbApi';
import { Movie, MovieDetail } from './service/types';

const app = express();
const PORT = 8080;

app.use(express.json());

const getPopularMovies = async () => {
  return (await moviesApi.getPopular()).results;
};

const generateMovieListHTML = (movies: Movie[]) => {
  return movies
    .map((movie) => {
      return /*html*/ `
      <li class="movie-item" key=${movie.id}>
        <div class="item">
          <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face/${movie.poster_path}" alt=${movie.title} loading="lazy" />
          <div class="item-desc">
            <p class="rate">
              <img src="/images/star_empty.png" class="star" />
              <span>${movie.vote_average}</span>
            </p>
            <strong>${movie.title}</strong>
          </div>
        </div>
      </li>
      `;
    })
    .join('');
};

  res.send(/*html*/ `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <title>영화 리뷰</title>
      </head>
      <body>
        테스트
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
