import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { moviesApi } from "../api/movies";
import { MovieDetailModal } from "../components/MovieDetailModal";
import type { MovieDetailResponse } from "../types/MovieDetail.types";

export default function MovieDetailPage({ initialMovieDetail }: {
  initialMovieDetail: MovieDetailResponse | null;
}) {
  const { id } = useParams();
  // 상세 ID가 바뀌면 이전 영화의 상태를 재사용하지 않는다.
  return <MovieDetailContent key={id} id={Number(id)} initialMovieDetail={initialMovieDetail} />;
}

function MovieDetailContent({ id, initialMovieDetail }: {
  id: number;
  initialMovieDetail: MovieDetailResponse | null;
}) {
  const initialMovie = initialMovieDetail?.id === id ? initialMovieDetail : null;
  const [movie, setMovie] = useState(initialMovie);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (initialMovie) return;
    let ignore = false;
    if (!Number.isSafeInteger(id) || id <= 0) {
      setError(true);
      return;
    }
    moviesApi.getDetail(id).then(
      ({ data }) => { if (!ignore) setMovie(data); },
      () => { if (!ignore) setError(true); }
    );
    return () => { ignore = true; };
  }, [id, initialMovie]);

  const close = () => {
    if (location.state?.fromHome) navigate(-1);
    else navigate("/", { replace: true });
  };

  if (movie) return <MovieDetailModal movie={movie} onClose={close} />;

  return (
    <div className="modal-background active">
      <div className="modal">
        <p role="status">{error ? "영화 정보를 불러오지 못했습니다." : "영화 정보를 불러오는 중입니다."}</p>
        <button onClick={close}>닫기</button>
      </div>
    </div>
  );
}
