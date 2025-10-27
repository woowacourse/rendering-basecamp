import { Request, Response, Router } from "express";
import { renderToString } from "react-dom/server";
import { moviesApi } from "../../client/api/movies";
import App from '../../client/App';
import Meta from '../../client/components/common/Meta';
import { renderPage } from "../utils/renderPage";

const detailRouter = Router();

detailRouter.get("/:movieId", async (req: Request, res: Response) => {
  try {
    const { movieId } = req.params;
    const [moviesResponse, detailResponse] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(Number(movieId)),
    ]);

    const movies = moviesResponse.data.results;
    const detail = detailResponse.data;

    const appHTML = renderToString(<App serverData={{ movies, detail }} currentPath={`/detail/${movieId}`} />);

    const title = detail.title;
    const description = detail.overview || '영화 상세 정보를 확인하세요.';
    const imageUrl = detail.poster_path
      ? `https://image.tmdb.org/t/p/w500${detail.poster_path}`
      : '/images/no_image.png';
    const pageUrl = `https://rendering-basecamp-production-46e7.up.railway.app/detail/${movieId}`;

    const ogTags = renderToString(<Meta title={title} description={description} imageUrl={imageUrl} pageUrl={pageUrl} />)

    const html = renderPage({
      appHTML,
      ogTags,
      initialData: { movies, detail },
    });

    res.send(html);
  } catch (error) {
    console.error("Error fetching movie detail:", error);
    res.status(500).send("<div>영화 정보를 불러오는데 실패했습니다.</div>");
  }
});

export default detailRouter;
