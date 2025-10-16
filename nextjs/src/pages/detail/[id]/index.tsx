import { moviesApi } from "@/api/movies";
import Meta from "@/components/common/Meta";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MovieList } from "@/components/MovieList";
import { useMovieDetailModal } from "@/hooks/useMovieDetailModal";
import { extractCurrentUrlByRequest } from "@/utils/extractCurrentUrlByRequest";
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

    const [movieDetailResponse, movieResponse] = await Promise.all([
      moviesApi.getDetail(Number(context.query?.id)),
      moviesApi.getPopular(),
    ]);

    const movies = movieResponse.data.results;

    return {
      props: {
        movies,
        movieDetail: movieDetailResponse.data,
        currentUrl: extractCurrentUrlByRequest(req),
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
  movies,
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
      <Meta
        title={movieDetail.title}
        description={movieDetail.overview}
        image={{ url: imageUrl, alt: movieDetail.title }}
        currentUrl={currentUrl}
      />
      <div id="wrap">
        <Header featuredMovie={movies[0]} />
        <MovieList movies={movies} />
        <Footer />
      </div>
    </>
  );
}
