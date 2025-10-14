import { moviesApi } from "@/api/movies";
import Meta from "@/components/common/Meta";
import { useMovieDetailModal } from "@/hooks/useMovieDetailModal";
import MovieHomePage from "@/pages";
import { MovieDetailResponse } from "@/types/MovieDetail.types";
import { GetServerSidePropsContext } from "next";
import { useEffect } from "react";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  try {
    const movieDetailResponse = await moviesApi.getDetail(
      Number(context.query?.id)
    );

    return {
      props: { movieDetail: movieDetailResponse.data },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

interface MovieDetailPageProps {
  movieDetail: MovieDetailResponse;
}

export default function MovieDetailPage({ movieDetail }: MovieDetailPageProps) {
  const { openMovieDetailModal } = useMovieDetailModal();

  useEffect(() => {
    if (movieDetail) {
      openMovieDetailModal(movieDetail);
    }
  }, [movieDetail, openMovieDetailModal]);

  const imageUrl = movieDetail.poster_path
    ? `https://image.tmdb.org/t/p/original${movieDetail.poster_path}`
    : "/images/no_image.png";

  return (
    <>
      <MovieHomePage />
      <Meta
        title={movieDetail.title}
        description={movieDetail.overview}
        imgUrl={imageUrl}
      />
    </>
  );
}
