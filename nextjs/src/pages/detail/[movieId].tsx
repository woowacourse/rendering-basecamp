import { useMovieDetailModal } from '../../hooks/useMovieDetailModal';
import { useEffect, useRef } from 'react';
import { Header } from '../../components/Header';
import { MovieList } from '../../components/MovieList';
import { Footer } from '../../components/Footer';
import Head from 'next/head';
import { MovieDetailResponse } from '@/types/MovieDetail.types';
import { MovieItem } from '@/types/Movie.types';
import { GetServerSideProps } from 'next';
import { moviesApi } from '@/api/movies';

interface MovieDetailPageProps {
  movies: MovieItem[];
  movieDetail: MovieDetailResponse;
}

interface DetailPageOpenModalProps {
  movieDetail: MovieDetailResponse;
}

export default function MovieDetailPage({ movies, movieDetail }: MovieDetailPageProps) {
  if (movies == null || movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  const posterUrl = movieDetail.poster_path
    ? `https://image.tmdb.org/t/p/original${movieDetail.poster_path}`
    : '/images/no_image.png';

  return (
    <>
      <Head>
        <title>{movieDetail.title}</title>
        <meta name="description" content={movieDetail.overview || `${movieDetail.title} 영화 정보`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta property="og:type" content="video.movie" />
        <meta property="og:title" content={`${movieDetail.title} - Movie Review`} />
        <meta property="og:description" content={movieDetail.overview || `${movieDetail.title} 영화 정보`} />
        <meta property="og:image" content={posterUrl} />

        <meta
          property="og:url"
          content={`https://rendering-basecamp-pink-seven.vercel.app//detail/${movieDetail.id}`}
        />
        <meta property="og:site_name" content="Movie Review App" />

        <meta property="video:release_date" content={movieDetail.release_date} />
        {movieDetail.genres &&
          movieDetail.genres.map((genre) => <meta key={genre.id} property="video:tag" content={genre.name} />)}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div id="wrap">
        <Header featuredMovie={movies[0]} />
        <MovieList movies={movies} />
        <Footer />
      </div>
      <DetailPageOpenModal movieDetail={movieDetail} />
    </>
  );
}

function DetailPageOpenModal({ movieDetail }: DetailPageOpenModalProps) {
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (onceRef.current === true) {
      return;
    }
    onceRef.current = true;
    openMovieDetailModal(movieDetail);
  }, [movieDetail, openMovieDetailModal]);

  return null;
}

export const getServerSideProps: GetServerSideProps<MovieDetailPageProps> = async (context) => {
  const { movieId } = context.params as { movieId: string };

  try {
    const [popularResponse, detailResponse] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(Number(movieId)),
    ]);

    return {
      props: {
        movies: popularResponse.data.results,
        movieDetail: detailResponse.data,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
};
