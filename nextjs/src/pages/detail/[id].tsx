import { useMovieDetailModal } from "../../hooks/useMovieDetailModal";
import { useEffect, useRef } from "react";
import { moviesApi } from "../../api/movies";
import MovieHomePage, { fetchMoviesForSSR } from "../MovieHomePage";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export const getServerSideProps = (async (context) => {
  const id = Number(context.params?.id);

  try {
    const [moviesRes, movieDetailRes] = await Promise.all([
      fetchMoviesForSSR(),
      moviesApi.getDetail(id),
    ]);

    const movies = moviesRes.props?.movies;
    const movieDetail = movieDetailRes.data;

    if (!movies || !movieDetail) return { notFound: true };

    return { props: { movies, movieDetail } };
  } catch {
    return { notFound: true };
  }
}) satisfies GetServerSideProps;

const MovieDetailPage: NextPage<Props> = ({ movies, movieDetail }) => {
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (onceRef.current) return;

    onceRef.current = true;
    openMovieDetailModal(movieDetail);
  }, [movieDetail, openMovieDetailModal]);

  const imageUrl = movieDetail.poster_path
    ? `https://image.tmdb.org/t/p/w500/${movieDetail.poster_path}`
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
    </>
  );
};

export default MovieDetailPage;
