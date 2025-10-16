import { moviesApi } from '@/api/movies';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { MovieList } from '@/components/MovieList';
import { OGHead } from '@/components/OGHead';
import { HOME_URL, TMDB_IMAGE_URL, TMDB_NO_IMAGE_URL } from '@/constants/url';
import { useMovieDetailModal } from '@/hooks/useMovieDetailModal';
import { MovieItem } from '@/types/Movie.types';
import { MovieDetailResponse } from '@/types/MovieDetail.types';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next/types';
import { useEffect, useRef } from 'react';

interface DetailPageProps {
  movies: MovieItem[];
  movieDetail: MovieDetailResponse;
}

export const getServerSideProps: GetServerSideProps<DetailPageProps> = async ({
  params,
}) => {
  try {
    const movieId = params?.id as string;
    const [movies, movieDetail] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(Number(movieId)),
    ]);
    return {
      props: { movies: movies.data.results, movieDetail: movieDetail.data },
    };
  } catch {
    return { notFound: true };
  }
};

const DetailPage = ({ movies, movieDetail }: DetailPageProps) => {
  return (
    <>
      <OGHead
        title={`${movieDetail.title} - 영화 상세 정보`}
        description={movieDetail.overview}
        imageUrl={
          movieDetail.poster_path
            ? `${TMDB_IMAGE_URL}original${movieDetail.poster_path}`
            : TMDB_NO_IMAGE_URL
        }
        url={`${HOME_URL}detail/${movieDetail.id}`}
        width={1920}
        height={800}
        alt={movieDetail.title}
      />
      <div id="wrap">
        <Header featuredMovie={movies[0]} />
        <MovieList movies={movies} />
        <OpenModal movieDetail={movieDetail} />
        <Footer />
      </div>
    </>
  );
};

interface OpenModalProps {
  movieDetail: MovieDetailResponse;
}

const OpenModal = ({ movieDetail }: OpenModalProps) => {
  const currentRef = useRef(false);
  const { openMovieDetailModal } = useMovieDetailModal();

  useEffect(() => {
    if (currentRef.current === true) {
      return;
    }

    (async () => {
      currentRef.current = true;
      openMovieDetailModal(movieDetail);
    })();
  }, [movieDetail, openMovieDetailModal]);

  return null;
};

export default DetailPage;
