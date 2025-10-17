import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Header } from '../components/Header';
import { MovieList } from '../components/MovieList';
import { Footer } from '../components/Footer';
import { MovieDetailModalLoader } from '../components/MovieDetailModalLoader';
import { moviesApi } from '../api/movies';
import { MovieItem } from '../types/Movie.types';
import { MovieDetailResponse } from '../types/MovieDetail.types';

interface HomePageProps {
  movies: MovieItem[];
  selectedMovie?: MovieDetailResponse | null;
}

export default function Home({ movies, selectedMovie }: HomePageProps) {
  const router = useRouter();
  const { movieId } = router.query;

  const handleCloseModal = () => {
    router.push('/', undefined, { shallow: true });
  };

  if (movies == null || movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <>
      <Head>
        <title>
          {selectedMovie
            ? `${selectedMovie.title} - 영화 리뷰 사이트`
            : '영화 리뷰 사이트'}
        </title>
        <meta
          name="description"
          content={
            selectedMovie
              ? selectedMovie.overview ||
                `${selectedMovie.title} 영화 정보를 확인하세요`
              : '인기 영화 리뷰를 확인하세요'
          }
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {selectedMovie && (
          <>
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="영화 리뷰 사이트" />
            <meta
              property="og:title"
              content={`${selectedMovie.title} - 영화 리뷰 사이트`}
            />
            <meta
              property="og:description"
              content={
                selectedMovie.overview ||
                `${selectedMovie.title} 영화 정보를 확인하세요`
              }
            />
            <meta
              property="og:image"
              content={
                selectedMovie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`
                  : `${
                      process.env.NEXT_PUBLIC_SITE_URL ||
                      'http://localhost:3000'
                    }/images/no_image.png`
              }
            />
            <meta
              property="og:url"
              content={`${
                process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
              }/?movieId=${selectedMovie.id}`}
            />
          </>
        )}
      </Head>
      <div id="wrap">
        <Header featuredMovie={movies[0]} />
        <MovieList movies={movies} />
        <Footer />

        {movieId && typeof movieId === 'string' && (
          <MovieDetailModalLoader
            movieId={parseInt(movieId)}
            close={handleCloseModal}
          />
        )}
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<
  HomePageProps
> = async context => {
  try {
    const movieResponse = await moviesApi.getPopular();
    const movies = movieResponse.data.results;

    const { movieId } = context.query;
    let selectedMovie: MovieDetailResponse | null = null;

    if (movieId && typeof movieId === 'string') {
      try {
        const movieDetailResponse = await moviesApi.getDetail(
          parseInt(movieId)
        );
        selectedMovie = movieDetailResponse.data;
      } catch (error) {
        console.error('영화 상세 정보 가져오기 실패:', error);
      }
    }

    return {
      props: {
        movies,
        selectedMovie,
      },
    };
  } catch (error) {
    console.error('영화 데이터 페칭 실패:', error);

    return {
      props: {
        movies: [],
        selectedMovie: null,
      },
    };
  }
};
