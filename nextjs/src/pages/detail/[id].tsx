import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from "next";
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
};

export const getServerSideProps = (async ({ params }) => {
  const id = params?.id;

  if (!id || !/^\d+$/.test(id)) {
    return { notFound: true };
  }

  const movieId = Number(id);

  if (!Number.isSafeInteger(movieId) || movieId <= 0) {
    return { notFound: true };
  }

  let movie: MovieDetailResponse;

  try {
    const response = await moviesApi.getDetail(movieId);
    movie = response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return { notFound: true };
    }

    throw error;
  }

  const response = await moviesApi.getPopular();

  return {
    props: {
      movie,
      movies: response.data.results,
    },
  };
}) satisfies GetServerSideProps<Props, { id: string }>;

export default function MovieDetailPage({
  movie,
  movies,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  return (
    <>
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
