import Head from "next/head";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MovieList } from "@/components/MovieList";
import { useMovieDetailModal } from "@/hooks/useMovieDetailModal";
import type { MovieItem } from "@/types/Movie.types";
import { moviesApi } from "@/api/movies";
import type { GetServerSideProps } from "next";

type PageProps = {
  movies: MovieItem[];
};

export default function HomePage({ movies }: PageProps) {
  const router = useRouter();
  const { openMovieDetailModal } = useMovieDetailModal();

  const isOpeningRef = useRef(false);

  useEffect(() => {
    const movieId = router.query.movieId as string | undefined;

    if (isOpeningRef.current) return;

    if (movieId) {
      isOpeningRef.current = true;
      moviesApi
        .getDetail(Number(movieId))
        .then(({ data }) => Promise.resolve(openMovieDetailModal(data)))
        .catch((e) => console.error("open modal (shallow) failed:", e))
        .finally(() => {
          isOpeningRef.current = false;
          router.replace("/", undefined, { shallow: true });
        });
    }
  }, [router.query.movieId, openMovieDetailModal, router]);

  if (!movies?.length) return <div>영화 정보를 불러오는데 실패했습니다.</div>;

  const featured = movies[0];

  return (
    <>
      <Head>
        <title>영화 홈</title>
        <meta name="description" content="인기 영화 모아보기" />
      </Head>

      <div id="wrap">
        <Header featuredMovie={featured} />
        <MovieList movies={movies} />
        <Footer />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  ctx
) => {
  try {
    const popularRes = await moviesApi.getPopular();
    const movies = popularRes.data.results as MovieItem[];

    const movieId = ctx.query.movieId;
    if (movieId && typeof movieId === "string") {
      try {
        const detailRes = await moviesApi.getDetail(Number(movieId));
        return { props: { movies, movieDetail: detailRes.data } };
      } catch {
        return { props: { movies } };
      }
    }
    return { props: { movies } };
  } catch (e) {
    console.error("인기 영화 실패:", e);
    return { props: { movies: [] } };
  }
};
