const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export const NO_IMAGE_PATH = "/images/no_image.png";

/**
 * 목록 썸네일 포스터 (og:image 에도 사용)
 */
export const getThumbnailUrl = (posterPath: string | null) =>
  posterPath ? `${TMDB_IMAGE_BASE_URL}/w500${posterPath}` : NO_IMAGE_PATH;

/**
 * 상세 모달 포스터
 */
export const getOriginalPosterUrl = (posterPath: string | null) =>
  posterPath ? `${TMDB_IMAGE_BASE_URL}/original${posterPath}` : NO_IMAGE_PATH;

/**
 * 헤더 배경 (react-csr 과 동일하게 poster_path 사용)
 */
export const getBannerUrl = (posterPath: string | null) =>
  `${TMDB_IMAGE_BASE_URL}/w1920_and_h800_multi_faces/${posterPath}`;
