import { moviesApi } from '@/api/movies';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { MovieList } from '@/components/MovieList';
import { OGHead } from '@/components/OGHead';
import { useMovieDetailModal } from '@/hooks/useMovieDetailModal';
import { MovieItem } from '@/types/Movie.types';
import { MovieDetailResponse } from '@/types/MovieDetail.types';
import { getImageUrl } from '@/utils/imageUrl';
import { GetServerSideProps } from 'next/types';
import { useRouter } from 'next/router';
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
        imageUrl={getImageUrl(movieDetail.poster_path)}
        url={`detail/${movieDetail.id}`}
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
  const modalUnmountRef = useRef<(() => void) | null>(null);
  const { openMovieDetailModal } = useMovieDetailModal();
  const router = useRouter();

  useEffect(() => {
    if (currentRef.current === true) {
      return;
    }

    currentRef.current = true;
    const { unmount } = openMovieDetailModal(movieDetail);
    modalUnmountRef.current = unmount;
  }, [movieDetail, openMovieDetailModal]);

  useEffect(() => {
    const handleRouteChange = () => {
      if (modalUnmountRef.current) {
        modalUnmountRef.current();
        modalUnmountRef.current = null;
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);

  return null;
};

export default DetailPage;
