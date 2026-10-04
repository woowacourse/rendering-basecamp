import { useMovieDetailModal } from "../hooks/useMovieDetailModal";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import MovieHomePage from "./MovieHomePage";
import { moviesApi } from "../api/movies";
import { usePopularMovies } from "../hooks/queries/usePopularMovies";
import { Loading } from "../components/common/Loading";

export default function MovieDetailPage() {
  return (
    <>
      <MovieHomeBackground />
      <DetailPageOpenModal />
    </>
  );
}

function MovieHomeBackground() {
  const { data: movies, isLoading, error } = usePopularMovies();

  if (error !== null) {
    return <p>영화 정보를 불러오는데 실패했습니다.</p>;
  }

  if (isLoading || movies === null) {
    return <Loading />;
  }

  if (movies.length === 0) {
    return <p>영화 정보가 없습니다.</p>;
  }

  return <MovieHomePage movies={movies} />;
}

function DetailPageOpenModal() {
  const router = useRouter();
  const movieId = router.query.movieId;
  const { openMovieDetailModal } = useMovieDetailModal();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    const id = typeof movieId === "string" ? Number(movieId) : NaN;
    if (!Number.isSafeInteger(id) || id <= 0) {
      setError("올바르지 않은 영화 ID입니다.");
      return;
    }

    let cancelled = false;
    setError(null);
    (async () => {
      try {
        const movieDetail = await moviesApi.getDetail(id);
        if (!cancelled) {
          void openMovieDetailModal(movieDetail.data);
        }
      } catch {
        if (!cancelled) {
          setError("영화 상세 정보를 불러오는데 실패했습니다.");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router.isReady, movieId, openMovieDetailModal]);

  return error ? <p role="alert">{error}</p> : null;
}
