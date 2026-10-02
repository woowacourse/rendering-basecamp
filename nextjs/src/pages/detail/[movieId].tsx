import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { GetServerSideProps } from 'next';
import { moviesApi } from '../../api/movies';
import { MovieHome } from '../../components/MovieHome';
import { MovieDetailModal } from '../../components/MovieDetailModal';
import { SITE_NAME } from '../../constants/site';
import { getRequestOrigin } from '../../utils/url';
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
        origin: getRequestOrigin(req),
      },
    };
  } catch {
    return { notFound: true };
  }
};

export default function MovieDetailPage({ movies, movie, origin }: Props) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(true);

  const description = movie.overview || '줄거리 정보가 없습니다.';
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : `${origin}/images/no_image.png`;

  const closeModal = () => {
    setIsModalOpen(false);
    router.replace('/', undefined, { scroll: false });
  };

  return (
    <>
      <Head>
        <title>{`${movie.title} | ${SITE_NAME}`}</title>
        <meta name="description" content={description} />
        <meta property="og:type" content="video.movie" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:url" content={`${origin}/detail/${movie.id}`} />
        <meta property="og:title" content={movie.title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
      </Head>
      <MovieHome movies={movies} />
      {isModalOpen && <MovieDetailModal movie={movie} onClose={closeModal} />}
    </>
  );
}
