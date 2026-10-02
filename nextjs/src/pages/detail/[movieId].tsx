import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { MovieDetailModal } from '../../components/MovieDetailModal';
import { MovieHome } from '../../components/MovieHome';
import { moviesApi } from '../../api/movies';
import type { MovieDetailResponse } from '../../types/MovieDetail.types';
import type { MovieItem } from '../../types/Movie.types';

interface MovieDetailPageProps {
  movies: MovieItem[];
  movie: MovieDetailResponse;
}

export default function MovieDetailPage({
  movies,
  movie,
}: MovieDetailPageProps) {
  const router = useRouter();

  const handleClose = () => {
    void router.push('/');
  };

  return (
    <>
      <MovieHome movies={movies} />
      <MovieDetailModal movie={movie} onClose={handleClose} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps<
  MovieDetailPageProps
> = async ({ params }) => {
  const movieIdParam = params?.movieId;

  if (typeof movieIdParam !== 'string') {
    return { notFound: true };
  }

  const movieId = Number(movieIdParam);

  if (!Number.isInteger(movieId) || movieId <= 0) {
    return { notFound: true };
  }

  try {
    const [popularResponse, detailResponse] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(movieId),
    ]);

    return {
      props: {
        movies: popularResponse.data.results,
        movie: detailResponse.data,
      },
    };
  } catch {
    return { notFound: true };
  }
};
