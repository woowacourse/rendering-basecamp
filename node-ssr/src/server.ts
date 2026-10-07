import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import path from 'path';
import { Header } from './components/Header';
import { MovieItem } from './components/MovieItem';
import { Footer } from './components/Footer';
import { MovieDetailModal } from './components/MovieDetailModal';
import { moviesApi } from './service/tmdbApi';
import { Movie } from './service/types';
import { escapeHtml } from './utils/escapeHtml';

const app = express();
const PORT = 8080;

app.use(express.json());

const renderDocument = (title: string, body: string) => /*html*/ `
    <!DOCTYPE html>
    <html lang="ko">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="stylesheet" href="/styles/index.css" />
            <title>${escapeHtml(title)}</title>
        </head>
        <body>
            ${body}
            <script src="/scripts/rating.js" defer></script>
        </body>
    </html>
`;

const renderHome = (movies: Movie[]) => /*html*/ `
    <div id="wrap">
        ${Header({ movie: movies[0] })}
        <main>
            <section class="container">
                <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
                <ul class="thumbnail-list">
                    ${movies.map((movie) => MovieItem({ movie })).join('')}
                </ul>
            </section>
        </main>
        ${Footer()}
    </div>
`;

app.get('/', async (_req: Request, res: Response) => {
    try {
        const { results } = await moviesApi.getPopular();

        res.send(renderDocument('영화 리뷰', renderHome(results)));
    } catch {
        res.status(500).send(renderDocument('영화 리뷰', '<p>영화 목록을 불러오지 못했습니다.</p>'));
    }
});

app.get('/detail/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    try {
        // 홈 화면 + 모달 전체를 그리므로 목록과 상세를 함께 받아온다. (목록 중복 호출은 일단 감수)
        const [{ results }, movie] = await Promise.all([moviesApi.getPopular(), moviesApi.getDetail(id)]);

        res.send(renderDocument(`${movie.title} | 영화 리뷰`, renderHome(results) + MovieDetailModal({ movie })));
    } catch {
        res.status(500).send(renderDocument('영화 리뷰', '<p>영화 정보를 불러오지 못했습니다.</p>'));
    }
});

// public 폴더 속 정적 파일을 웹에서 접근할 수 있도록 만든다.
app.use(express.static(path.join(__dirname, '../public')));

app.listen(PORT, (): void => {
    console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
