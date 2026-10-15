import { Router, type Request, type Response } from 'express';
import axios from 'axios';
import { renderToString } from 'react-dom/server';
import App, { type InitialData } from '../../client/App';
import type { MovieResponse } from '../../client/types/Movie.types';
import type { MovieDetailResponse } from '../../client/types/MovieDetail.types';

const router = Router();

// 서버에서만 TMDB에 인증 토큰을 보내고, React 렌더링 전에 데이터를 준비한다.
const getMovieData = <T,>(pathname: string) => axios.get<T>(
  `https://api.themoviedb.org/3${pathname}`,
  {
    params: { language: 'ko-KR' },
    headers: { Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}` },
    timeout: 10_000,
  }
);

const escapeHTML = (value: string) => value.replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]!);

function generateHTML(data: InitialData, origin: string) {
  const movie = data.movie;
  const title = movie?.title || '영화 리뷰';
  const description = movie?.overview || '지금 인기 있는 영화를 확인해 보세요.';
  const image = movie?.poster_path
    ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
    : `${origin}/images/no_image.png`;
  const body = renderToString(<App initialData={data} />);
  // JSON 안의 </script>가 HTML 태그로 해석되지 않도록 '<'를 치환한다.
  const initialData = JSON.stringify(data).replace(/</g, '\\u003c');

  return `<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHTML(title)}</title>
    <meta property="og:title" content="${escapeHTML(title)}" />
    <meta property="og:description" content="${escapeHTML(description)}" />
    <meta property="og:image" content="${escapeHTML(image)}" />
    <meta property="og:url" content="${escapeHTML(origin + (movie ? `/detail/${movie.id}` : '/'))}" />
    <link rel="stylesheet" href="/static/styles/index.css" />
    <script defer src="/static/bundle.js"></script>
  </head>
  <body>
    <div id="root">${body}</div>
    <script id="initial-data" type="application/json">${initialData}</script>
  </body>
</html>`;
}

async function renderPage(req: Request, res: Response) {
  const id = req.params.id;
  if (id && (!/^\d+$/.test(id) || !Number.isSafeInteger(Number(id)) || Number(id) < 1)) {
    res.status(400).send('올바른 영화 ID를 입력해 주세요.');
    return;
  }

  try {
    const [popular, detail] = await Promise.all([
      getMovieData<MovieResponse>('/movie/popular'),
      id ? getMovieData<MovieDetailResponse>(`/movie/${id}`) : undefined,
    ]);
    const data = { movies: popular.data.results, movie: detail?.data };
    const origin = process.env.PUBLIC_ORIGIN || process.env.RENDER_EXTERNAL_URL || `${req.protocol}://${req.get('host')}`;
    res.send(generateHTML(data, origin));
  } catch (error) {
    const status = axios.isAxiosError(error) && error.response?.status === 404 ? 404 : 502;
    res.status(status).send('영화 정보를 불러오는데 실패했습니다.');
  }
}

// 제공된 Express 라우터를 사용한다. 별도의 브라우저 라우터는 만들지 않는다.
router.get('/', renderPage);
router.get('/detail/:id', renderPage);

// Hydration 이후 기존 영화 클릭 동작에서 사용하는 JSON 요청이다.
router.get('/api/movie/:id', async (req, res) => {
  try {
    const movie = await getMovieData<MovieDetailResponse>(`/movie/${req.params.id}`);
    res.json(movie.data);
  } catch {
    res.status(502).json({ message: '영화 정보를 불러오는데 실패했습니다.' });
  }
});

export default router;
