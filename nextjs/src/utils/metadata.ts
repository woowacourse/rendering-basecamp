import { MovieItem } from "@/types/Movie.types";
import { MovieDetailResponse } from "@/types/MovieDetail.types";

interface PageMetadata {
  pageTitle: string;
  pageDescription: string;
  ogImageUrl: string;
  ogType: string;
  ogImageWidth: string;
  ogImageHeight: string;
  ogUrl: string;
}

export const getPageMetadata = (
  currentMovieDetail: MovieDetailResponse | undefined,
  featuredMovie: MovieItem
): PageMetadata => {
  if (currentMovieDetail) {
    return {
      pageTitle: `${currentMovieDetail.title} - Movie Database`,
      pageDescription:
        currentMovieDetail.overview ||
        `${currentMovieDetail.title}의 상세 정보`,
      ogImageUrl: `https://image.tmdb.org/t/p/original${currentMovieDetail.poster_path}`,
      ogType: "video.movie",
      ogImageWidth: "1000",
      ogImageHeight: "1500",
      ogUrl: `https://rendering-basecamp-git-guesung-gueit214s-projects.vercel.app/?movieId=${currentMovieDetail.id}`,
    };
  }

  return {
    pageTitle: "인기 영화 - Movie Database",
    pageDescription:
      "최신 인기 영화 정보를 확인하세요. TMDB 기반 영화 데이터베이스",
    ogImageUrl: featuredMovie.backdrop_path
      ? `https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`
      : `https://image.tmdb.org/t/p/original${featuredMovie.poster_path}`,
    ogType: "website",
    ogImageWidth: "1280",
    ogImageHeight: "720",
    ogUrl:
      "https://rendering-basecamp-git-guesung-gueit214s-projects.vercel.app/",
  };
};
