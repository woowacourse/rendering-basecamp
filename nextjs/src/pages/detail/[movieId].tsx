import { useRouter } from 'next/router';
import MovieHomePage from '../../components/MovieHomePage';
import { moviesApi } from '../../api/movies';
import type { GetServerSideProps } from 'next';
import { MovieItem } from '@/types/Movie.types';
import { MovieDetailModal } from '@/components/MovieDetailModal';
import { MovieDetailResponse } from '@/types/MovieDetail.types';

interface MovieDetailPageProps {
  movies: MovieItem[];
  movieDetail: MovieDetailResponse;
}

export const getServerSideProps = (async (context) => {
  const movieId = Number(context.params?.movieId);

  try {
    const [popularResponse, detailResponse] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(movieId),
    ]);

    return {
      props: {
        movies: popularResponse.data.results,
        movieDetail: detailResponse.data,
      },
    };
  } catch (error) {
    console.error('영화 불러오기에 실패하였습니다.', error);
    return { notFound: true };
  }
}) satisfies GetServerSideProps<MovieDetailPageProps>;

export default function MovieDetailPage({ movies, movieDetail }: MovieDetailPageProps) {
  const router = useRouter();

  return (
    <>
      <MovieHomePage movies={movies} />
      <MovieDetailModal movie={movieDetail} onClose={() => router.push('/')} />
    </>
  );
}
