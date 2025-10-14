import { moviesApi } from "@/api/movies";
import Meta from "@/components/common/Meta";
import { useMovieDetailModal } from "@/hooks/useMovieDetailModal";
import MovieHomePage from "@/pages";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { useEffect } from "react";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  try {
    const { req } = context;
    const host = req.headers.host;
    const url = req.url;
    const movieDetailResponse = await moviesApi.getDetail(
      Number(context.query?.id)
    );

    return {
      props: {
        movieDetail: movieDetailResponse.data,
        currentUrl: `${host}${url}`,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

type MovieDetailPageProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

export default function MovieDetailPage({
  movieDetail,
  currentUrl,
}: MovieDetailPageProps) {
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
        image={{ url: imageUrl, alt: movieDetail.title }}
        currentUrl={currentUrl}
      />
    </>
  );
}
