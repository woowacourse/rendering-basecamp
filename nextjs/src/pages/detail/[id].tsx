import { useEffect, useRef } from 'react';
import { useMovieDetailModal } from '@/hooks/useMovieDetailModal';
import { Footer } from '@/components/Footer';
import { MovieList } from '@/components/MovieList';
import { MovieDetailResponse } from '@/types/MovieDetail.types';
import { MovieItem } from '@/types/Movie.types';
import { Header } from '@/components/Header';
import { GetServerSideProps } from 'next';
import { moviesApi } from '@/api/movies';
import { useRouter } from 'next/router';

interface MovieDetailPageProps {
  movie: MovieDetailResponse;
  movies: MovieItem[];
}

interface DetailPageOpenModalProps {
  movie: MovieDetailResponse;
}

export default function MovieDetailPage({
  movie,
  movies,
}: MovieDetailPageProps) {
  if (!movies || !movie) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <>
      <div id="wrap">
        <Header featuredMovie={movies[0]} />
        <MovieList movies={movies} />
        <Footer />
      </div>
      <DetailPageOpenModal movie={movie} />
    </>
  );
}

function DetailPageOpenModal({ movie }: DetailPageOpenModalProps) {
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (onceRef.current === true) return;

    (async () => {
      onceRef.current = true;
      openMovieDetailModal(movie).then(() => {
        router.push('/');
      });
    })();
  }, [router, movie, openMovieDetailModal]);

  return null;
}

export const getServerSideProps: GetServerSideProps<
  MovieDetailPageProps
> = async (context) => {
  const { id } = context.params as { id: string };

  try {
    const [movieDetailResponse, moviesResponse] = await Promise.all([
      moviesApi.getDetail(Number(id)),
      moviesApi.getPopular(),
    ]);

    const movie = movieDetailResponse.data;
    const movies = moviesResponse.data.results;

    return {
      props: {
        movie,
        movies,
      },
    };
  } catch (error) {
    console.error('Failed to fetch movie detail:', error);
    return {
      notFound: true,
    };
  }
};
