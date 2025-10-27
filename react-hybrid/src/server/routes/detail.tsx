import { Router, Request, Response } from "express";
import { moviesApi } from "../../client/api/movies";
import MovieDetailPage from "../../client/pages/MovieDetailPage";
import { renderToString } from "react-dom/server";
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
    const movieDetail = detailResponse.data;

    const appHTML = renderToString(
      <MovieDetailPage movies={movies} detail={movieDetail} />
    );

    const ogTags = `
      <meta property="og:title" content="${movieDetail.title}" />
      <meta property="og:description" content="${
        movieDetail.overview || "영화 상세 정보를 확인하세요."
      }" />
      <meta property="og:image" content="https://image.tmdb.org/t/p/w500${
        movieDetail.poster_path
      }" />
      <meta property="og:url" content="https://localhost:3000/detail/${movieId}" />
      <meta name="twitter:card" content="summary_large_image" />
    `;

    const html = renderPage({
      appHTML,
      ogTags,
      initialData: { movies, detail: movieDetail },
    });

    res.send(html);
  } catch (error) {
    console.error("Error fetching movie detail:", error);
    res.status(500).send("<div>영화 정보를 불러오는데 실패했습니다.</div>");
  }
});

export default detailRouter;
