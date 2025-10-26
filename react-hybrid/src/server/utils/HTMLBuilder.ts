import { MovieItem } from "../types/Movie.types";
import { MovieDetailResponse } from "../types/MovieDetail.types";

type HTMLBuilderType<TInitData extends object> = {
  generateBody: (content: string) => HTMLBuilderType<TInitData>;
  generateMetaTags: (
    movie: MovieItem | MovieDetailResponse
  ) => HTMLBuilderType<TInitData>;
  initData: (data: {
    path: string;
    movies: MovieItem[];
    movieDetail?: MovieDetailResponse;
  }) => HTMLBuilderType<TInitData>;
  getHTML: () => string;
};

export function HTMLBuilder<
  TInitData extends object = {}
>(): HTMLBuilderType<TInitData> {
  let body = "";
  let metaTags = "";
  let initData = {} as TInitData;

  const builder: any = {
    generateBody(content: string) {
      body += content;
      return builder;
    },
    generateMetaTags(movie: MovieItem | MovieDetailResponse) {
      const image = movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : "";

      metaTags = `
        <title>${movie.title}</title>
        <meta name="description" content="${movie.overview}" />
        <meta property="og:title" content="${movie.title}" />
        <meta property="og:description" content="${movie.overview}" />
        ${image ? `<meta property="og:image" content="${image}" />` : ""}
        <meta property="og:type" content="video.movie" />
      `;
      return builder;
    },
    initData({
      path,
      movies,
      movieDetail,
    }: {
      path: string;
      movies: MovieItem[];
      movieDetail?: MovieDetailResponse;
    }) {
      initData = { ...initData, path, movies, movieDetail } as TInitData & {
        path: string;
        movies: MovieItem[];
        movieDetail?: MovieDetailResponse;
      };
      return builder;
    },
    getHTML() {
      return `
        <!DOCTYPE html>
        <html lang="ko">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="stylesheet" href="/static/styles/index.css" />
            <title>영화 리뷰</title>
            ${metaTags}
          </head>
          <body>
            <div id="root">${body}</div>
            <script>
              window.__INITIAL_DATA__ = ${JSON.stringify(initData)};
            </script>
            <script src="/static/bundle.js"></script>
          </body>
        </html>
      `;
    },
  };

  return builder;
}
