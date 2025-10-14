import { Header } from "./Header";
import { MovieList } from "./MovieList";
import { Loading } from "./common/Loading";
import { usePopularMovies } from "../hooks/queries/usePopularMovies";
import type { MovieItem } from "../types/Movie.types";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { moviesApi } from "../api/movies";
import { useMovieDetailModal } from "../hooks/useMovieDetailModal";
import Head from "next/head";

export default function HomeView({
  initialMovies,
}: {
  initialMovies?: MovieItem[] | null;
}) {
  const { data: movies, isLoading } = usePopularMovies(initialMovies, {
    enabled: initialMovies == null,
  });
  const router = useRouter();
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);
  const [movieForHead, setMovieForHead] = useState<{
    title: string;
    overview: string;
    ogImage: string;
  } | null>(null);

  if (isLoading === true) {
    return <Loading />;
  }

  if (movies == null || movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  // shallow query로 들어온 movieId를 감지해 모달만 띄운다 (스크롤 유지)
  useEffect(() => {
    const { movieId } = router.query;
    if (typeof movieId !== "string" || onceRef.current === true) {
      return;
    }
    (async () => {
      onceRef.current = true;
      const movieDetail = await moviesApi.getDetail(Number(movieId));
      const movie = movieDetail.data;
      const ogImage = movie.poster_path
        ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
        : `/images/no_image.png`;
      setMovieForHead({
        title: movie.title,
        overview: movie.overview ?? "",
        ogImage,
      });
      await openMovieDetailModal(movieDetail.data);
      // 닫히면 쿼리만 제거 (shallow) → URL/OG는 홈으로, 스크롤 유지
      await router.replace(
        { pathname: router.pathname, query: {} },
        undefined,
        { shallow: true }
      );
      setMovieForHead(null);
      onceRef.current = false;
    })();
  }, [router.query.movieId, openMovieDetailModal]);

  return (
    <>
      {movieForHead && (
        <Head>
          <title>{movieForHead.title}</title>
          <meta name="description" content={movieForHead.overview} />
          <meta property="og:title" content={movieForHead.title} />
          <meta property="og:description" content={movieForHead.overview} />
          <meta property="og:image" content={movieForHead.ogImage} />
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:title" content={movieForHead.title} />
          <meta
            property="twitter:description"
            content={movieForHead.overview}
          />
          <meta property="twitter:image" content={movieForHead.ogImage} />
        </Head>
      )}
      <Header featuredMovie={movies[0]} />
      <MovieList movies={movies} />
    </>
  );
}
