import { moviesApi } from "../api/movies";
import type { InferGetServerDataType } from "../types";
import { useMovieDetailModal } from "../hooks/useMovieDetailModal";
import { useEffect } from "react";
import { Header } from "../components/Header";
import { MovieList } from "../components/MovieList";
import { Footer } from "../components/Footer";
import Meta from "../components/common/Meta";
import type { GetServerDataParams } from "../../server/routes";

export const getServerData = async ({
  movieId,
  currentUrl,
}: GetServerDataParams) => {
  try {
    const [popularMovie, movieDetail] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(Number(movieId)),
    ]);

    return {
      popularMovie: popularMovie.data.results,
      movieDetail: movieDetail.data,
      currentUrl,
    };
  } catch (error) {
    return {
      popularMovie: [],
      movieDetail: null,
      currentUrl,
    };
  }
};

type MovieDetailPageProps = InferGetServerDataType<typeof getServerData>;

export default function MovieDetailPage({
  popularMovie,
  movieDetail,
  currentUrl,
}: MovieDetailPageProps) {
  const { openMovieDetailModal } = useMovieDetailModal();

  useEffect(() => {
    openMovieDetailModal(movieDetail);
  }, [movieDetail, openMovieDetailModal]);

  const imageUrl = movieDetail.poster_path
    ? `https://image.tmdb.org/t/p/original${movieDetail.poster_path}`
    : "/static/images/no_image.png";

  return (
    <>
      <Meta
        title={movieDetail.title}
        description={movieDetail.overview}
        image={{ url: imageUrl, alt: movieDetail.title }}
        currentUrl={currentUrl}
      />

      <div id="wrap">
        <Header featuredMovie={popularMovie[0]} />
        <MovieList movies={popularMovie} />
        <Footer />
      </div>
    </>
  );
}
