import { useMovieDetailModal } from "@/hooks/useMovieDetailModal";
import { useEffect, useRef } from "react";
import { moviesApi } from "@/api/movies";
import { GetServerSideProps } from "next";
import { MovieDetailResponse } from "@/types/MovieDetail.types";
import { MovieItem } from "@/types/Movie.types";
import MovieHomePage from "../index";
import Head from "next/head";

interface DetailPageProps {
  movies: MovieItem[];
  movieDetail: MovieDetailResponse;
}

export default function MovieDetailPage({
  movies,
  movieDetail,
}: DetailPageProps) {
  const ogTitle = `${movieDetail.title} - 영화 상세정보`;
  const ogDescription = movieDetail.overview;
  const ogImage = `https://image.tmdb.org/t/p/w1280${movieDetail.poster_path}`;

  return (
    <>
      <Head>
        <title>{movieDetail.title} - 영화 상세정보</title>
        <meta name="description" content={ogDescription} />

        <meta property="og:type" content="video.movie" />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:image" content={ogImage} />
        <meta
          property="og:url"
          content={`https://movie-review.com/detail/${movieDetail.id}`}
        />

        {movieDetail.release_date && (
          <meta
            property="og:video:release_date"
            content={movieDetail.release_date}
          />
        )}
        {movieDetail.vote_average && (
          <meta name="rating" content={movieDetail.vote_average.toString()} />
        )}
      </Head>

      <MovieHomePage movies={movies} />
      <AutoOpenModal movieDetail={movieDetail} />
    </>
  );
}

function AutoOpenModal({ movieDetail }: { movieDetail: MovieDetailResponse }) {
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (onceRef.current) return;

    onceRef.current = true;
    openMovieDetailModal(movieDetail);
  }, [movieDetail, openMovieDetailModal]);

  return null;
}

export const getServerSideProps: GetServerSideProps<DetailPageProps> = async (
  context
) => {
  const { movieId } = context.params!;

  try {
    const [moviesResponse, movieDetailResponse] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(Number(movieId)),
    ]);

    return {
      props: {
        movies: moviesResponse.data.results,
        movieDetail: movieDetailResponse.data,
      },
    };
  } catch (error) {
    console.error("Failed to fetch data:", error);

    return {
      notFound: true,
    };
  }
};
