import 'dotenv/config';
import express, {Request, Response} from 'express';
import path from 'path';
import {moviesApi} from './service/tmdbApi';
import {renderHomePage, renderPopularMovies} from './views/renderHomePage';
import {renderMovieDetailPage} from './views/renderMovieDetailPage';

const app = express();
const PORT = 8080;

app.use(express.json());

app.get('/', async (_req: Request, res: Response) => {
	try {
		const movies = await moviesApi.getPopular();
		res.send(renderHomePage(movies.results));
	} catch (error) {
		console.error('인기 영화 페이지 생성 실패:', error);
		res.status(502).send('영화 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
	}
});

app.get('/detail/:id', async (req: Request, res: Response) => {
	const movieId = Number(req.params.id);
	if (!Number.isSafeInteger(movieId) || movieId <= 0) {
		res.status(400).send('올바르지 않은 영화 ID입니다.');
		return;
	}

	try {
		const [movies, detailMovie] = await Promise.all([
			moviesApi.getPopular(),
			moviesApi.getDetail(movieId),
		]);
		res.send(renderMovieDetailPage(movies.results, detailMovie, renderPopularMovies));
	} catch (error) {
		console.error(`영화 상세 페이지 생성 실패 (ID: ${movieId}):`, error);
		res.status(502).send('영화 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
	}
});

// public 폴더 속 정적 파일을 웹에서 접근할 수 있도록 만든다.
app.use(express.static(path.join(__dirname, '../public')));

app.listen(PORT, (): void => {
	console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
