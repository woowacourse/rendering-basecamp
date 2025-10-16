import { useEffect, useRef } from "react";
import { useMovieDetailModal } from "@/hooks/useMovieDetailModal";
import { moviesApi } from "@/api/movies";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MovieList } from "@/components/MovieList";
import Head from "next/head";
import type { MovieDetailResponse } from "@/types/MovieDetail.types";
import type { MovieItem } from "@/types/Movie.types";
import type { GetServerSideProps } from "next";

interface MovieDetailPageProps {
  movies: MovieItem[] | null;
  movieDetail: MovieDetailResponse | null;
}

export default function MovieDetailPage({
  movies,
  movieDetail,
}: MovieDetailPageProps) {
  if (!movies || !movieDetail) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <>
      <Head>
        <title>{movieDetail.title}</title>
        <meta name="description" content={movieDetail.overview} />
      </Head>
      <div id="wrap">
        <Header featuredMovie={movies[0]} />
        <MovieList movies={movies} />
        <Footer />
      </div>

      <DetailPageOpenModal movieDetail={movieDetail} />
    </>
  );
}

interface DetailPageOpenModalProps {
  movieDetail: MovieDetailResponse;
}

function DetailPageOpenModal({ movieDetail }: DetailPageOpenModalProps) {
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

export const getServerSideProps: GetServerSideProps<
  MovieDetailPageProps
> = async (context) => {
  const { id } = context.query;

  try {
    const popularRes = await moviesApi.getPopular();
    const movies: MovieItem[] = popularRes.data.results;

    if (!id) {
      return {
        props: {
          movies: movies ?? null,
          movieDetail: null,
        },
      };
    }

    const detailRes = await moviesApi.getDetail(Number(id));
    const movieDetail: MovieDetailResponse = detailRes.data;

    return {
      props: {
        movies,
        movieDetail,
      },
    };
  } catch (error) {
    console.error("Error fetching movie data:", error);
    return {
      props: {
        movies: null,
        movieDetail: null,
      },
    };
  }
};
