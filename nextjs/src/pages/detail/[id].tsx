import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';
import MovieHomePage from '../index';
import { moviesApi } from '@/api/movies';
import { useMovieDetailModal } from '@/hooks/useMovieDetailModal';
import type { MovieItem } from '@/types/Movie.types';
import type { MovieDetailResponse } from '@/types/MovieDetail.types';

interface DetailProps {
  initialMovies: MovieItem[];
  movieDetail: MovieDetailResponse | null;
}

export const getServerSideProps: GetServerSideProps<DetailProps> = async (context) => {
  const { id } = context.params as { id: string };

  try {
    const [popularResponse, detailResponse] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(Number(id)),
    ]);

    return {
      props: {
        initialMovies: popularResponse.data.results,
        movieDetail: detailResponse.data,
      },
    };
  } catch (error) {
    console.error('Failed to fetch detail page data:', error);
    return {
      props: {
        initialMovies: [],
        movieDetail: null,
      },
    };
  }
};

function DetailPageOpenModal({ movieDetail }: { movieDetail: MovieDetailResponse }) {
  const { openMovieDetailModal } = useMovieDetailModal();

  useEffect(() => {
    return openMovieDetailModal(movieDetail);
  }, [movieDetail, openMovieDetailModal]);

  return null;
}

export default function MovieDetailPage({ initialMovies, movieDetail }: DetailProps) {
  return (
    <>
      {movieDetail && (
        <Head>
          <title>{movieDetail.title} - 영화 리뷰</title>
          <meta name="description" content={movieDetail.overview || `${movieDetail.title} 상세 정보`} />
          
          <meta property="og:title" content={movieDetail.title} />
          <meta property="og:description" content={movieDetail.overview || `${movieDetail.title} 상세 정보`} />
          <meta property="og:image" content={`https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`} />
          <meta property="og:type" content="website" />
        </Head>
      )}
      
      <MovieHomePage initialMovies={initialMovies} />
      {movieDetail && <DetailPageOpenModal movieDetail={movieDetail} />}
    </>
  );
}
