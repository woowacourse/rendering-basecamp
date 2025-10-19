import Modal from "../components/Modal";
import { MovieDetail } from "../service/types";

export default async function getModal({
  movieDetail,
}: {
  movieDetail: MovieDetail;
}) {
  return Modal({ movieDetail });
}
