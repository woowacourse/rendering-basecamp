import { useEffect, useRef } from "react";
import { useMovieDetailModal } from "@/hooks/useMovieDetailModal";
import { moviesApi } from "@/api/movies";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MovieList } from "@/components/MovieList";
import type { MovieDetailResponse } from "@/types/MovieDetail.types";
import type { MovieItem } from "@/types/Movie.types";
import type { GetServerSideProps } from "next";
import { OGMetaTags } from "@/components/OGMetaTags";

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
      <OGMetaTags
        title={movieDetail.title}
        description={movieDetail.overview}
        url={`https://rendering-basecamp-mu.vercel.app/detail/${movieDetail.id}`}
        siteName="Movielist"
        type="video.movie"
        movieDuration={movieDetail.runtime.toString()}
        movieReleaseDate={movieDetail.release_date}
        movieTags={movieDetail.genres.map((g) => g.name).join(", ")}
        image={`https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`}
      />
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
    if (onceRef.current) return;

    onceRef.current = true;
    openMovieDetailModal(movieDetail);
  }, [movieDetail, openMovieDetailModal]);

  return null;
}

export const getServerSideProps: GetServerSideProps<
  MovieDetailPageProps
> = async (context) => {
  const { id } = context.query;

  try {
    const popularPromise = moviesApi.getPopular();
    const detailPromise = id ? moviesApi.getDetail(Number(id)) : null;

    const [popularRes, detailRes] = await Promise.all([
      popularPromise,
      detailPromise ?? Promise.resolve(null),
    ]);

    const movies: MovieItem[] = popularRes.data.results;
    const movieDetail: MovieDetailResponse | null = detailRes
      ? detailRes.data
      : null;

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
