import { useMovieDetailModal } from "../../hooks/useMovieDetailModal";
import { useEffect, useRef } from "react";
import { moviesApi } from "../../api/movies";
import MovieHomePage, { fetchMoviesForSSR } from "../MovieHomePage";
import type { MovieItem } from "../../types/Movie.types";
import type { MovieDetailResponse } from "../../types/MovieDetail.types";
import type { GetServerSidePropsContext } from "next/types";
import Head from "next/head";

interface MovieDetailPageProps {
  movies: MovieItem[] | null;
  movieDetail: MovieDetailResponse | null;
}

export default function MovieDetailPage({
  movies,
  movieDetail,
}: MovieDetailPageProps) {
  if (movies == null || movieDetail == null) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  const imageUrl = movieDetail.poster_path
    ? "https://image.tmdb.org/t/p/w500/" + movieDetail.poster_path
    : "/images/no_image.png";
  return (
    <>
      <Head>
        <meta property="og:title" content={movieDetail.title} />
        <meta property="og:description" content={movieDetail.overview} />
        <meta property="og:image" content={imageUrl} />
      </Head>
      <MovieHomePage
        movies={movies}
        pageTitle={`${movieDetail.title} - MovieList`}
      />
      <DetailPageOpenModal initialMovieDetail={movieDetail} />
    </>
  );
}

function DetailPageOpenModal({
  initialMovieDetail,
}: {
  initialMovieDetail: MovieDetailResponse;
}) {
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (initialMovieDetail == null || onceRef.current === true) {
      return;
    }
    onceRef.current = true;
    openMovieDetailModal(initialMovieDetail);
  }, [initialMovieDetail, openMovieDetailModal]);

  return null;
}

const fetchDetailForSSR = async (context: GetServerSidePropsContext) => {
  try {
    const { id } = context.params as { id: string | null };

    if (id == null) {
      return { props: {} };
    }

    const movieDetail = await moviesApi.getDetail(Number(id));

    return {
      props: {
        movieDetail: movieDetail.data,
      },
    };
  } catch {
    return { props: {} };
  }
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<{ props: MovieDetailPageProps }> => {
  try {
    const [moviesRes, detailRes] = await Promise.all([
      fetchMoviesForSSR(),
      fetchDetailForSSR(context),
    ]);

    return {
      props: {
        movies: moviesRes.props.movies,
        movieDetail: detailRes.props.movieDetail ?? null,
      },
    };
  } catch {
    return { props: { movies: null, movieDetail: null } };
  }
};
