import { useEffect, useRef } from 'react';
import Head from 'next/head';
import { useMovieDetailModal } from '@/hooks/useMovieDetailModal';
import { Footer } from '@/components/Footer';
import { MovieList } from '@/components/MovieList';
import { MovieDetailResponse } from '@/types/MovieDetail.types';
import { MovieItem } from '@/types/Movie.types';
import { Header } from '@/components/Header';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
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
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!movies || !movie) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  const movieImage = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/images/dizzy_planet.png';

  return (
    <>
      <Head>
        <title>{movie.title}</title>
        <meta
          name="description"
          content={`${movie.title} 영화 정보를 확인할 수 있습니다.`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="movieDetail" />
        <meta property="og:title" content={movie.title} />
        <meta property="og:description" content={movie.overview} />
        <meta property="og:image" content={movieImage} />
        <meta
          property="og:image:alt"
          content={`${movies[0].title} 포스터 이미지`}
        />
        <meta
          property="og:url"
          content={`${
            process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
          }/detail/${movie.id}`}
        />
      </Head>
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
> = async ({ params }) => {
  try {
    const [movieDetailResponse, moviesResponse] = await Promise.all([
      moviesApi.getDetail(Number(params?.id)),
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
