import { Request, Response, Router } from "express";
import { renderToString } from "react-dom/server";
import { moviesApi } from "../../client/api/movies";
import App from "../../client/App";
import { generateHTMLTemplate } from "../utils/htmlTemplate";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const movies = await moviesApi.getPopular();

  const renderedApp = renderToString(
    <App initialData={{ movies: movies.data.results }} />
  );

  const html = generateHTMLTemplate({
    title: "영화 리뷰",
    metadata: {
      type: "website",
      title: "영화 리뷰 - 인기 영화 목록",
      description: "최신 인기 영화를 확인하고 리뷰를 작성해보세요.",
      url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
      siteName: "영화 리뷰",
      keywords: "영화, 영화리뷰, 인기영화, 최신영화",
    },
    bodyContent: renderedApp,
    initialData: {
      movies: movies.data.results,
    },
  });

  res.send(html);
});

export default router;
