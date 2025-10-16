import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { moviesApi } from "@/api/movies";
import type { MovieDetailResponse } from "@/types/MovieDetail.types";
import type { MovieItem } from "@/types/Movie.types";
import { useEffect, useRef } from "react";
import { useMovieDetailModal } from "@/hooks/useMovieDetailModal";
import MetaTags from "@/components/common/MetaTags";
import Home from "..";

type Props = { movies: MovieItem[]; detail: MovieDetailResponse | null };

export const getServerSideProps: GetServerSideProps<Props> = async ({
  params,
}) => {
  const id = Number(params?.id);
  if (!id) return { notFound: true };

  try {
    const { data: popularData } = await moviesApi.getPopular(1);
    const { data: detailData } = await moviesApi.getDetail(id);

    const movies = popularData.results ?? [];
    const detail = detailData ?? null;

    return { props: { movies, detail } };
  } catch {
    return { props: { movies: [], detail: null } };
  }
};

export default function MovieDetailPage({
  movies,
  detail,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (detail === null || onceRef.current === true) {
      return;
    }
    (async () => {
      onceRef.current = true;
      openMovieDetailModal(detail);
    })();
  }, [detail, openMovieDetailModal]);

  const imageUrl = detail?.poster_path
    ? `https://image.tmdb.org/t/p/original${detail?.poster_path}`
    : "/images/no_image.png";
  return (
    <>
      <MetaTags
        title={detail?.original_title ?? "제목 없음"}
        description={detail?.overview ?? "설명 없음"}
        image={imageUrl}
        url={`https://rendering-basecamp-blue.vercel.app/detail/${detail?.id}`}
      />
      <Home popularMovies={movies} />
    </>
  );
}
