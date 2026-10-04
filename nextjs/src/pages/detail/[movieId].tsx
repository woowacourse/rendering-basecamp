import { useRouter } from 'next/router';
import MovieHome from '../../components/MovieHome';
import { moviesApi } from '../../api/movies';
import type { GetServerSideProps } from 'next';
import { MovieItem } from '@/types/Movie.types';
import { MovieDetailModal } from '@/components/MovieDetailModal';
import { MovieDetailResponse } from '@/types/MovieDetail.types';
import Head from 'next/head';

interface MovieDetailPageProps {
  movies: MovieItem[];
  movieDetail: MovieDetailResponse;
  origin: string;
}

export const getServerSideProps = (async (context) => {
  const movieId = Number(context.params?.movieId);
  const protocol = context.req.headers['x-forwarded-proto'] ?? 'http';
  const origin = `${protocol}://${context.req.headers.host}`;

  try {
    const [popularResponse, detailResponse] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(movieId),
    ]);

    return {
      props: {
        movies: popularResponse.data.results,
        movieDetail: detailResponse.data,
        origin,
      },
    };
  } catch (error) {
    console.error('영화 불러오기에 실패하였습니다.', error);
    return { notFound: true };
  }
}) satisfies GetServerSideProps<MovieDetailPageProps>;

export default function MovieDetailPage({ movies, movieDetail, origin }: MovieDetailPageProps) {
  const router = useRouter();

  const imageUrl = movieDetail.poster_path
    ? `https://image.tmdb.org/t/p/original${movieDetail.poster_path}`
    : `${origin}/images/no_image.png`;

  return (
    <>
      <Head>
        <title>{movieDetail.title}</title>
        <meta property="og:title" content={movieDetail.title} />
        <meta property="og:description" content={movieDetail.overview} />
        <meta property="og:image" content={imageUrl} />
      </Head>
      <MovieHome movies={movies} />
      <MovieDetailModal movie={movieDetail} onClose={() => router.push('/')} />
    </>
  );
}
