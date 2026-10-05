import type { GetServerSideProps } from 'next';
import Head from 'next/head';
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
  const imagePath = movie.poster_path ?? movie.backdrop_path;
  const openGraphImage = imagePath
    ? `https://image.tmdb.org/t/p/w500${imagePath}`
    : null;

  const handleClose = () => {
    void router.push('/');
  };

  return (
    <>
      <Head>
        <title>{`${movie.title} | MovieList`}</title>
        <meta property="og:type" content="website" />
        <meta property="og:title" content={movie.title} />
        {openGraphImage && (
          <meta property="og:image" content={openGraphImage} />
        )}
      </Head>
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

  const [popularResult, detailResult] = await Promise.allSettled([
    moviesApi.getPopular(),
    moviesApi.getDetail(movieId),
  ]);

  if (detailResult.status === 'rejected') {
    return { notFound: true };
  }

  return {
    props: {
      movies:
        popularResult.status === 'fulfilled'
          ? popularResult.value.data.results
          : [],
      movie: detailResult.value.data,
    },
  };
};
