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

  const { movieId } = router.query;
  useEffect(() => {
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
      await router.replace(
        { pathname: router.pathname, query: {} },
        undefined,
        { shallow: true }
      );
      setMovieForHead(null);
      onceRef.current = false;
    })();
  }, [movieId, openMovieDetailModal, router]);

  if (isLoading === true) {
    return <Loading />;
  }

  if (movies == null || movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

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
