import type { MovieItem } from "./Movie.types";
import type { MovieDetailResponse } from "./MovieDetail.types";

declare global {
	interface Window {
		__INITIAL_DATA__: {
			movies?: MovieItem[];
			movieDetail?: MovieDetailResponse;
		};
	}
}
