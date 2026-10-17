import type { MovieItem } from "./Movie.types";
import type { MovieDetailResponse } from "./MovieDetail.types";

/**
 * 서버가 렌더링에 사용한 데이터.
 * 서버는 이 데이터로 HTML을 만들고, 브라우저는 같은 데이터로 hydration 한다.
 */
export interface InitialData {
  movies: MovieItem[];
  movieDetail: MovieDetailResponse | null;
}
