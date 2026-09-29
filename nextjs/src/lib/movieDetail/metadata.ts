import type { MetadataData } from "@/components/common/Metadata";
import type { MovieDetailResponse } from "@/types/MovieDetail.types";

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export const toMovieMetadata = (movie: MovieDetailResponse): MetadataData => ({
  title: `${movie.title} | 영화 정보`,
  description: movie.overview,
  ogTitle: movie.title,
  ogDescription: movie.overview,
  ogImage: movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
    : undefined,
});
