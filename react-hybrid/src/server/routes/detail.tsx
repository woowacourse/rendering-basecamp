import { Request, Response, Router } from "express";
import { renderToString } from "react-dom/server";
import { moviesApi } from "../../client/api/movies";
import App from "../../client/App";
import { generateHTMLTemplate } from "../utils/htmlTemplate";

const router = Router();

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const movies = await moviesApi.getPopular();
  const movie = await moviesApi.getDetail(Number(id));

  const renderedApp = renderToString(
    <App initialData={{ movie: movie.data, movies: movies.data.results }} />
  );

  const movieData = movie.data;
  const imageUrl = `https://image.tmdb.org/t/p/w500${movieData.poster_path}`;

  const html = generateHTMLTemplate({
    title: `${movieData.title} - 영화 리뷰`,
    metadata: {
      type: "video.movie",
      title: `${movieData.title} - 영화 리뷰`,
      description: movieData.overview,
      url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
      siteName: "영화 리뷰",
      image: imageUrl,
      imageWidth: "500",
      imageHeight: imageUrl,
      keywords: `영화, 영화리뷰, ${movieData.title}`,
    },
    bodyContent: renderedApp,
    initialData: {
      movie: movie.data,
      movies: movies.data.results,
    },
  });

  res.send(html);
});

export default router;
