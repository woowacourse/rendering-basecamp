import { Router, Request, Response } from "express";
import { moviesApi } from "../../client/api/movies";
import MovieHomePage from "../../client/pages/MovieHomePage";
import { renderToString } from "react-dom/server";
import { renderPage } from "../utils/renderPage";

const homeRouter = Router();

homeRouter.get("/", async (_: Request, res: Response) => {
  try {
    const movieResponse = await moviesApi.getPopular();
    const movies = movieResponse.data.results;
    const topMovie = movies[0];

    const appHTML = renderToString(<MovieHomePage movies={movies} />);

    const ogTags = `
      <meta property="og:title" content="인기 영화 리뷰" />
      <meta property="og:description" content="현재 가장 인기 있는 영화를 만나보세요." />
      <meta property="og:image" content="https://image.tmdb.org/t/p/w500${topMovie.poster_path}" />
      <meta property="og:url" content="https://localhost:3000/" />
      <meta name="twitter:card" content="summary_large_image" />
    `;

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
