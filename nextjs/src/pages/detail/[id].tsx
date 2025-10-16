import { GetServerSideProps } from "next";
import { useEffect, useRef } from "react";
import { moviesApi } from "@/api/movies";
import { useMovieDetailModal } from "@/hooks/useMovieDetailModal";
import MovieHomePage from "../MovieHomePage";
import { MovieItem } from "@/types/Movie.types";
import { MovieDetailResponse } from "@/types/MovieDetail.types";

type DetailPageProps = {
  popularMovies: MovieItem[];
  movieDetail: MovieDetailResponse | null;
};

export default function MovieDetailPage({
  popularMovies,
  movieDetail,
}: DetailPageProps) {
  return (
    <>
      <DetailPageOpenModal movieDetail={movieDetail} />
      <MovieHomePage initialMovies={popularMovies} />
    </>
  );
}

function DetailPageOpenModal({
  movieDetail,
}: {
  movieDetail: MovieDetailResponse | null;
}) {
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (!movieDetail || onceRef.current) return;
    onceRef.current = true;
    openMovieDetailModal(movieDetail);
  }, [movieDetail, openMovieDetailModal]);

  return null;
}

export const getServerSideProps: GetServerSideProps<DetailPageProps> = async (
  context
) => {
  const { id } = context.params!;

  try {
    const [popularRes, detailRes] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(Number(id)),
    ]);

    return {
      props: {
        popularMovies: popularRes.data.results,
        movieDetail: detailRes.data,
      },
    };
  } catch (e) {
    return {
      props: {
        popularMovies: [],
        movieDetail: null,
      },
    };
  }
};
