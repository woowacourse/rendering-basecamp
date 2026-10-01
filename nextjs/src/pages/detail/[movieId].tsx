import { useMovieDetailModal } from "../../hooks/useMovieDetailModal";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { moviesApi } from "../../api/movies";

import Head from "next/head";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { MovieDetailResponse } from "@/types/MovieDetail.types";

export const getServerSideProps = (async ({ params }) => {
  // 환경변수사용법
  // https://nextjs.org/docs/pages/guides/environment-variables
  const res = await fetch(`https://api.themoviedb.org/3/movie/${params?.movieId}?language=ko-KR`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
    },
  });
  const movieDetail: MovieDetailResponse = await res.json();
  // Pass data to the page via props
  return { props: { movieDetail } };
}) satisfies GetServerSideProps<{ movieDetail: MovieDetailResponse }>;

export default function MovieDetailPage({
  movieDetail,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>{movieDetail.title}</title>
        <meta property="og:title" content={movieDetail.title} />
        <meta
          property="og:image"
          content={`https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`}
        />
        <meta property="og:description" content={movieDetail.overview} />
      </Head>
      <DetailPageOpenModal />;
    </>
  );
}

function DetailPageOpenModal() {
  const router = useRouter();
  const { movieId } = router.query;

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
