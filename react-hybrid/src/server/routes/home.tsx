import { Router, Request, Response } from "express";
import { moviesApi } from "../../client/api/movies";
import MovieHomePage from "../../client/pages/MovieHomePage";
import { renderToString } from "react-dom/server";
import { renderPage } from "../utils/renderPage";
import Meta from '../../client/components/common/Meta';

const homeRouter = Router();

homeRouter.get("/", async (_: Request, res: Response) => {
  try {
    const movieResponse = await moviesApi.getPopular();
    const movies = movieResponse.data.results;
    const topMovie = movies[0];

    const appHTML = renderToString(<MovieHomePage movies={movies} />);

    const title = 'Movielist';
    const description = '인기 있는 영화를 만나보세요!';
    const imageUrl = topMovie.poster_path
    ? `https://image.tmdb.org/t/p/w500${topMovie.poster_path}`
    : '/images/no_image.png';
    const pageUrl = 'https://rendering-basecamp-production-46e7.up.railway.app/';

    const ogTags = renderToString(<Meta title={title} description={description} imageUrl={imageUrl} pageUrl={pageUrl} />)

    const html = renderPage({
      appHTML,
      ogTags,
      initialData: { movies },
    });

    res.send(html);
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).send("<div>영화 정보를 불러오는데 실패했습니다.</div>");
  }
});

export default homeRouter;
