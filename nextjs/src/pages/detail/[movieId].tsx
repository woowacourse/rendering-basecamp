import { moviesApi } from "@/api/movies";
import { useMovieDetailModal } from "@/hooks/useMovieDetailModal";
import { useEffect } from "react";
import type { MovieDetailResponse } from "@/types/MovieDetail.types";
import type { GetServerSideProps } from "next";
import type { MovieItem } from "@/types/Movie.types";
import { Header } from "@/components/Header";
import { MovieList } from "@/components/MovieList";
import { Footer } from "@/components/Footer";
import { MetaData } from "@/components/common/MetaData";
import { getAbsolutePageUrl } from "@/utils/getAbsolutePageUrl";

interface MovieDetailPageProps {
  movies: MovieItem[];
  movie: MovieDetailResponse;
  pageUrl: string;
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
  resolvedUrl,
}) => {
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

    return {
      props: {
        movies: popularMovies,
        movie: popularMovie,
        pageUrl: getAbsolutePageUrl({ req, resolvedUrl }),
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};

export default function MovieDetailPage({
  movies,
  movie,
  pageUrl,
}: MovieDetailPageProps) {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
    : "/images/no_image.png";
  return (
    <>
      <MetaData
        pageUrl={pageUrl}
        title={`영화 상세보기 | ${movie.title}`}
        description={movie.overview}
        imageUrl={imageUrl}
        movie={movie}
      />
      <div id='wrap'>
        <Header featuredMovie={movies[0]} />
        <MovieList movies={movies} />
        <Footer />
      </div>
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
