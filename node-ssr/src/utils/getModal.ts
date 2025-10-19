import Modal from "../components/Modal";
import { moviesApi } from "../service/tmdbApi";
import { MovieDetailResponse } from "../service/types";

export default async function getModal({ movieId }: { movieId: string }) {
  const movieDetail: MovieDetailResponse = await moviesApi.getDetail(
    Number(movieId)
  );

  return Modal({ movieDetail });
}
