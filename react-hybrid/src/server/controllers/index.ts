import { Request, Response } from "express";
import { fetchMovieDetailPageData, fetchPopularMovies } from "../services";
import { renderPage } from "../ssr/renderPage";

export const getHomePage = async (req: Request, res: Response) => {
  const movies = await fetchPopularMovies();
  const topMovie = movies[0];

  const html = await renderPage(req, {
    routeType: "home",
    initialData: { movies },
    ogTarget: topMovie,
  });

  res.send(html);
};

export const getDetailPage = async (req: Request, res: Response) => {
  const movieId = Number(req.params.id);
  const { movies, selectedMovieDetail } = await fetchMovieDetailPageData(
    movieId
  );

  const html = await renderPage(req, {
    routeType: "detail",
    initialData: { movies, selectedMovieDetail },
    ogTarget: selectedMovieDetail,
  });

  res.send(html);
};
