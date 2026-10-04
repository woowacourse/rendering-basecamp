import Head from "next/head";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { moviesApi } from "../../api/movies";
import { MovieDetailResponse } from "@/types/MovieDetail.types";
import { MovieDetailModal } from "@/components/MovieDetailModal";
import MovieHome, { type MovieHomeProps } from "@/components/MovieHome";

interface MovieDetailPageProps extends MovieHomeProps {
  movie: MovieDetailResponse | null;
}

export const getServerSideProps = (async ({ params }) => {
  const movieId = params?.movieId;

  if (
    typeof movieId !== "string" ||
    !/^[1-9]\d*$/.test(movieId) ||
    !Number.isSafeInteger(Number(movieId))
  ) {
    return { notFound: true };
  }

  const [detailResponse, popularResponse] = await Promise.all([
    moviesApi.getDetail(Number(movieId)).catch(() => null),
    moviesApi.getPopular(),
  ]);

  return {
    props: {
      movie: detailResponse?.data ?? null,
      movies: popularResponse.data.results,
    },
  };
}) satisfies GetServerSideProps<MovieDetailPageProps, { movieId: string }>;

export default function MovieDetailPage({
  movie,
  movies,
}: MovieDetailPageProps) {
  const title = movie?.title ?? "영화 리뷰";
  const overview = movie?.overview || "인기 영화를 살펴보세요.";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const imageUrl = movie?.poster_path
    ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
    : new URL("/images/no_image.png", siteUrl).href;

  const pageUrl = movie ? new URL(`/detail/${movie.id}`, siteUrl).href : null;
  return (
    <>
      <Head>
        <title>{movie ? `${movie.title} | 영화 리뷰` : "영화 리뷰"}</title>
        <meta
          name="description"
          content={movie?.overview || movie?.title || "인기 영화를 살펴보세요."}
        />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={overview} />
        <meta property="og:image" content={imageUrl} />
        {pageUrl && <meta property="og:url" content={pageUrl} />}
        <meta property="og:type" content={movie ? "video.movie" : "website"} />
      </Head>
      <MovieHome movies={movies} />
      {movie ? (
        <InitialDetailModal key={movie.id} movie={movie} />
      ) : (
        <p role="alert">영화 상세 정보를 불러오지 못했습니다.</p>
      )}
    </>
  );
}

function InitialDetailModal({ movie }: { movie: MovieDetailResponse }) {
  const router = useRouter();

  return (
    <MovieDetailModal
      movie={movie}
      onClose={() => {
        router.replace("/", undefined, { scroll: false });
      }}
    />
  );
}
