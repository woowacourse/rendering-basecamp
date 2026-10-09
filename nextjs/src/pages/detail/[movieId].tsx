import { useState } from 'react';
import { isAxiosError } from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { GetServerSideProps } from 'next';
import { moviesApi } from '../../api/movies';
import { MovieHome } from '../../components/MovieHome';
import { MovieDetailModal } from '../../components/MovieDetailModal';
import { ROUTES } from '../../constants/routes';
import { SITE_NAME } from '../../constants/site';
import { hasNavigatedInApp } from '../../utils/navigation';
import { getSiteOrigin } from '../../utils/url';
import type { MovieItem } from '../../types/Movie.types';
import type { MovieDetailResponse } from '../../types/MovieDetail.types';

interface Props {
  movies: MovieItem[];
  movie: MovieDetailResponse;
  origin: string;
}

export const getServerSideProps: GetServerSideProps<
  Props,
  { movieId: string }
> = async ({ params, req }) => {
  const movieId = Number(params?.movieId);

  if (!Number.isInteger(movieId) || movieId < 1) {
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
        origin: getSiteOrigin(req),
      },
    };
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return { notFound: true };
    }

    throw new Error('Failed to load movie detail from TMDB');
  }
};

export default function MovieDetailPage({ movies, movie, origin }: Props) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(true);

  const description =
    movie.overview || `${movie.title}의 평점과 정보를 확인해 보세요.`;
  const imagePath = movie.backdrop_path ?? movie.poster_path;
  const imageUrl = imagePath
    ? `https://image.tmdb.org/t/p/w780${imagePath}`
    : `${origin}/images/no_image.png`;

  const closeModal = () => {
    setIsModalOpen(false);

    if (hasNavigatedInApp()) {
      router.back();
      return;
    }

    router.replace(ROUTES.HOME, undefined, { scroll: false });
  };

  return (
    <>
      <Head>
        <title>{`${movie.title} | ${SITE_NAME}`}</title>
        <meta name="description" content={description} />
        <meta property="og:type" content="video.movie" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta
          property="og:url"
          content={`${origin}${ROUTES.MOVIE_DETAIL(movie.id)}`}
        />
        <meta property="og:title" content={movie.title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
      </Head>
      <MovieHome movies={movies} />
      {isModalOpen && <MovieDetailModal movie={movie} onClose={closeModal} />}
    </>
  );
}
