import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { MovieDetailModal } from '../../components/MovieDetailModal';
import { moviesApi } from '../../api/movies';
import { MovieDetailResponse } from '../../types/MovieDetail.types';
import { MovieItem } from '../../types/Movie.types';

interface MovieDetailPageProps {
  movie: MovieDetailResponse;
  popularMovies: MovieItem[];
}

export default function MovieDetailPage({
  movie,
  popularMovies,
}: MovieDetailPageProps) {
  const router = useRouter();

  const handleClose = () => {
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>{movie.title} - 영화 리뷰 사이트</title>
        <meta
          name="description"
          content={movie.overview || `${movie.title} 영화 정보를 확인하세요`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div id="wrap">
        <Header featuredMovie={popularMovies[0]} />
        <MovieDetailModal movie={movie} onClose={handleClose} />
        <Footer />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<
  MovieDetailPageProps
> = async context => {
  const { movieId } = context.params!;

  try {
    const [movieResponse, popularMoviesResponse] = await Promise.all([
      moviesApi.getDetail(Number(movieId)),
      moviesApi.getPopular(),
    ]);

    return {
      props: {
        movie: movieResponse.data,
        popularMovies: popularMoviesResponse.data.results,
      },
    };
  } catch (error) {
    console.error('영화 상세 데이터 페칭 실패:', error);

    return {
      notFound: true,
    };
  }
};
