import { Request } from "express";
import { renderToString } from "react-dom/server";
import App from "../../client/App";
import { MovieItem } from "../../client/types/Movie.types";
import { MovieDetailResponse } from "../../client/types/MovieDetail.types";
import { getBaseHTMLTemplate } from "./baseTemplate";
import {
  buildInitialDataScript,
  buildOGTags,
  injectHTMLParts,
} from "./buildHTML";

export async function renderPage(
  req: Request,
  {
    routeType,
    initialData,
    ogTarget,
  }: {
    routeType: "home" | "detail";
    initialData: {
      movies: MovieItem[];
      selectedMovieDetail?: MovieDetailResponse;
    };
    ogTarget: MovieItem | MovieDetailResponse;
  }
): Promise<string> {
  const appHTML = renderToString(
    <App routeType={routeType} initialData={initialData} />
  );
  const ogTagsHTML = buildOGTags(req, ogTarget);
  const initialDataScript = buildInitialDataScript(routeType, initialData);

  return injectHTMLParts({
    template: getBaseHTMLTemplate(),
    ogTags: ogTagsHTML,
    body: appHTML,
    initialData: initialDataScript,
  });
}
