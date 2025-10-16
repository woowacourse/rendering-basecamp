import { moviesApi } from "@/api/movies";
import { OGMetaTags } from "@/components/OGMetaTags";
import { MovieItem } from "@/types/Movie.types";
import { GetServerSideProps } from "next";
import { MainContent } from "..";
import { MovieDetailResponse } from "@/types/MovieDetail.types";
import { useEffect, useRef } from "react";
import { useMovieDetailModal } from "@/hooks/useMovieDetailModal";

type Detail = {
  movies: MovieItem[];
  movieDetail: MovieDetailResponse;
};

type DetailModal = {
  movieDetail: MovieDetailResponse;
};

function DetailPageOpenModal({ movieDetail }: DetailModal) {
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (onceRef.current === true) return;
    (async () => {
      onceRef.current = true;
      openMovieDetailModal(movieDetail);
    })();
  }, [movieDetail, openMovieDetailModal]);

  return null;
}

function Detail({ movies, movieDetail }: Detail) {
  return (
    <>
      <OGMetaTags
        title="영화 리뷰"
        description="오늘 뭐 볼까? 지금 인기 있는 영화를 확인해보세요!"
        url="/"
      />
      <MainContent movies={movies} />
      <DetailPageOpenModal movieDetail={movieDetail} />
    </>
  );
}

export default Detail;

export const getServerSideProps: GetServerSideProps<Detail> = async (
  context
) => {
  const { id } = context.params!;
  const movieId = id as string;

  try {
    const [popularResponse, detailResponse] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(Number(movieId)),
    ]);

    const movies = popularResponse.data.results;
    const movieDetail = detailResponse.data;

    return { props: { movies, movieDetail } };
  } catch (error) {
    console.error("영화 정보를 불러오는 데 실패했습니다:", error);
    return { notFound: true };
  }
};
