import { Request } from "express";
import { MovieItem } from "../../client/types/Movie.types";
import { MovieDetailResponse } from "../../client/types/MovieDetail.types";
import { getFullRequestUrl, getOGMetaTagsHTML } from "../utils";

export const buildOGTags = (
  req: Request,
  movie: MovieItem | MovieDetailResponse
) => {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
    : "/static/images/no_image.png";

  return getOGMetaTagsHTML({
    title: movie.title || "영화 추천 사이트",
    description: movie.overview || "최신 인기 영화와 상세 정보를 확인해보세요.",
    url: getFullRequestUrl(req),
    image: imageUrl,
  });
};

export const buildInitialDataScript = (
  routeType: "home" | "detail",
  initialData: {
    movies: MovieItem[];
    selectedMovieDetail?: MovieDetailResponse;
  }
) => {
  return /*html*/ `
    <script>
      window.__INITIAL_DATA__ = ${JSON.stringify({ routeType, initialData })};
    </script>
  `;
};

export const injectHTMLParts = ({
  template,
  ogTags,
  body,
  initialData,
}: {
  template: string;
  ogTags: string;
  body: string;
  initialData: string;
}) => {
  return template
    .replace("<!--{OG_TAGS}-->", ogTags)
    .replace("<!--{BODY_AREA}-->", body)
    .replace("<!--{INIT_DATA_AREA}-->", initialData);
};
