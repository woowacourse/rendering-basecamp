import { moviesApi } from "@/api/movies";
import { useMovieDetailModal } from "@/hooks/useMovieDetailModal";
import { useEffect } from "react";
import type { MovieDetailResponse } from "@/types/MovieDetail.types";
import type { GetServerSideProps } from "next";
import type { MovieItem } from "@/types/Movie.types";
import MovieHomePage from "..";

interface MovieDetailPageProps {
  movies: MovieItem[];
  movie: MovieDetailResponse;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const movieId = Number(params?.movieId);

  if (!movieId) {
    return {
      notFound: true,
    };
  }

  try {
    const [popularMoviesResponse, popularMovieResponse] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(movieId),
    ]);

    const popularMovies = Array.isArray(popularMoviesResponse?.data?.results)
      ? popularMoviesResponse.data.results
      : [];
    const popularMovie = popularMovieResponse?.data;
    if (!popularMovie || !popularMovie) {
      return {
        notFound: true,
      };
    }

    return { props: { movies: popularMovies, movie: popularMovie } };
  } catch {
    return {
      notFound: true,
    };
  }
};

export default function MovieDetailPage({
  movies,
  movie,
}: MovieDetailPageProps) {
  return (
    <>
      <MovieHomePage movies={movies} />
      <DetailPageOpenModal movie={movie} />
    </>
  );
}

function DetailPageOpenModal({ movie }: { movie: MovieDetailResponse }) {
  const { openMovieDetailModal } = useMovieDetailModal();

  useEffect(() => {
    openMovieDetailModal(movie);
  }, [movie, openMovieDetailModal]);

  return null;
}
