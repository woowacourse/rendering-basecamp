import { useRouter } from "next/router";
import { useMovieDetailModal } from "../../hooks/useMovieDetailModal";
import { useEffect, useRef } from "react";
import { moviesApi } from "../../api/movies";
import Head from "next/head";
import { Header } from "../../components/Header";
import { MovieList } from "../../components/MovieList";
import { Footer } from "../../components/Footer";
import { usePopularMovies } from "../../hooks/queries/usePopularMovies";
import { Loading } from "../../components/common/Loading";

export default function MovieDetailPage() {
  const router = useRouter();
  const { movieId } = router.query;
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);
  const { data: movies, isLoading } = usePopularMovies();

  useEffect(() => {
    if (!movieId || typeof movieId !== "string" || onceRef.current === true) {
      return;
    }
    (async () => {
      onceRef.current = true;
      const movieDetail = await moviesApi.getDetail(Number(movieId));
      await openMovieDetailModal(movieDetail.data);
    })();
  }, [movieId, openMovieDetailModal]);

  if (isLoading === true) {
    return <Loading />;
  }

  if (movies == null || movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <>
      <Head>
        <title>영화 상세 - 영화 리뷰</title>
        <meta name="description" content="영화 상세 정보를 확인하고 평점을 남겨보세요" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div id="wrap">
        <Header featuredMovie={movies[0]} />
        <MovieList movies={movies} />
        <Footer />
      </div>
    </>
  );
}
