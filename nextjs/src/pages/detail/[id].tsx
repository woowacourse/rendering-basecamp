import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { isAxiosError } from "axios";
import { moviesApi } from "../../api/movies";
import { Header } from "../../components/Header";
import { MovieList } from "../../components/MovieList";
import { Footer } from "../../components/Footer";
import { MovieDetailModal } from "../../components/MovieDetailModal";
import type { MovieItem } from "../../types/Movie.types";
import type { MovieDetailResponse } from "../../types/MovieDetail.types";

type Props = {
  movie: MovieDetailResponse;
  movies: MovieItem[];
  pageUrl: string;
};

export const getServerSideProps = (async ({ params, req }) => {
  const id = params?.id;

  if (!id || !/^\d+$/.test(id)) {
    return { notFound: true };
  }

  const movieId = Number(id);

  if (!Number.isSafeInteger(movieId) || movieId <= 0) {
    return { notFound: true };
  }

  const [detailResponse, popularResponse] = await Promise.all([
    moviesApi.getDetail(movieId).catch((error: unknown) => {
      if (isAxiosError(error) && error.response?.status === 404) {
        return null;
      }

      throw error;
    }),
    moviesApi.getPopular(),
  ]);

  if (!detailResponse) {
    return { notFound: true };
  }

  const movie = detailResponse.data;
  const protocol = req.headers["x-forwarded-proto"] === "https" ? "https" : "http";
  const host = req.headers.host ?? "localhost:3000";
  const pageUrl = `${protocol}://${host}/detail/${movie.id}`;

  return {
    props: {
      movie,
      movies: popularResponse.data.results,
      pageUrl,
    },
  };
}) satisfies GetServerSideProps<Props, { id: string }>;

export default function MovieDetailPage({
  movie,
  movies,
  pageUrl,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const description =
    movie.overview?.trim().slice(0, 160) ||
    `${movie.title}의 영화 정보와 평점을 확인하세요.`;
  const imageUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : movie.poster_path
      ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
      : new URL("/images/no_image.png", pageUrl).toString();

  return (
    <>
      <Head>
        <title>{`${movie.title} | MovieList`}</title>
        <meta name="description" content={description} key="description" />
        <meta property="og:title" content={movie.title} key="og-title" />
        <meta
          property="og:description"
          content={description}
          key="og-description"
        />
        <meta property="og:image" content={imageUrl} key="og-image" />
        <meta
          property="og:image:alt"
          content={`${movie.title} 대표 이미지`}
          key="og-image-alt"
        />
        <meta property="og:url" content={pageUrl} key="og-url" />
        <meta property="og:type" content="video.movie" key="og-type" />
        <meta property="og:locale" content="ko_KR" key="og-locale" />
      </Head>
      <div id="wrap">
        {movies.length > 0 && <Header featuredMovie={movies[0]} />}
        <MovieList movies={movies} />
        <Footer />
      </div>
      <MovieDetailModal
        key={movie.id}
        movie={movie}
        onClose={() => void router.push("/")}
      />
    </>
  );
}
