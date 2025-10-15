import {useEffect, useRef} from "react";
import {moviesApi} from "@/api/movies";
import {useMovieDetailModal} from "@/hooks/useMovieDetailModal";

export default function MovieDetailPage() {
  return (
    <>
      {/*<MovieHomePage/>*/}
      <DetailPageOpenModal/>
    </>
  );
}

function DetailPageOpenModal() {
  const {movieId} = useParams();
  const {openMovieDetailModal} = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (movieId == null || onceRef.current) {
      return;
    }
    (async () => {
      onceRef.current = true;
      const movieDetail = await moviesApi.getDetail(Number(movieId));
      openMovieDetailModal(movieDetail.data);
    })();
  }, [movieId, openMovieDetailModal]);

  return null;
}
