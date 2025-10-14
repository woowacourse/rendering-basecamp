import { moviesApi } from "@/api/movies";
import { Loading } from "@/components/common/Loading";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MovieList } from "@/components/MovieList";
import { usePopularMovies } from "@/hooks/queries/usePopularMovies";
import { useMovieDetailModal } from "@/hooks/useMovieDetailModal";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

export default function MovieDetailPage() {
  const { data: movies, isLoading } = usePopularMovies();

  if (isLoading === true) {
    return <Loading />;
  }

  if (movies == null || movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <>
      <Head>
        <title>영화 상세 - 영화 추천 사이트</title>
      </Head>
      <div id="wrap">
        <Header featuredMovie={movies[0]} />
        <MovieList movies={movies} />
        <Footer />
        <DetailPageOpenModal />
      </div>
    </>
  );
}

function DetailPageOpenModal() {
  const router = useRouter();
  const { id: movieId } = router.query;
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (movieId == null || onceRef.current === true) {
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
