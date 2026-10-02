import { moviesApi } from "@/api/movies";
import MovieHomePage from "@/components/MovieHomePage";
import { useMovieDetailModal } from "@/hooks/useMovieDetailModal";
import { MovieItem } from "@/types/Movie.types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

export const getServerSideProps = (async () => {
  try {
    const response = await moviesApi.getPopular();
    return { props: { movies: response.data.results } };
  } catch {
    return { props: { movies: [] } };
  }
}) satisfies GetServerSideProps<{ movies: MovieItem[] }>;

export default function MovieDetailPage({
  movies,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <MovieHomePage movies={movies} />
      <DetailPageOpenModal />
    </>
  );
}

function DetailPageOpenModal() {
  const router = useRouter();
  const movieId = router.query.id;
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
