import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { MovieDetailModal } from '@/components/MovieDetailModal';
import { MovieDetailErrorModal } from '@/components/MovieDetailErrorModal';
import { MovieList } from '@/components/MovieList';
import type { MovieItem } from '@/types/Movie.types';
import type { MovieDetailResponse } from '@/types/MovieDetail.types';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getPopularMovies, getMovieDetail } from '@/server/movies';
import type { QueryResult } from '@/types/Query.types';
import { useMovieDetail } from '@/hooks/queries/useMovieDetail';
import { usePopularMovies } from '@/hooks/queries/usePopularMovies';

const SITE_URL = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000';
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og_default.png`;

interface HomeProps {
  popularMovies: QueryResult<MovieItem[]>;
  selectedMovie: QueryResult<MovieDetailResponse> | null;
}

export const getServerSideProps = (async ({ params, res }) => {
  const slug = params?.slug ?? [];
  const movieId = slug[1];
  const isDetail = slug.length === 2 && slug[0] === 'detail' && /^[1-9]\d*$/.test(movieId);

  if (slug.length > 0 && !isDetail) return { notFound: true };

  const [popularMovies, selectedMovie] = await Promise.all([
    getPopularMovies(),
    movieId ? getMovieDetail(movieId) : Promise.resolve(null),
  ]);

  res.statusCode = selectedMovie?.error?.status ?? popularMovies.error?.status ?? 200;

  return {
    props: {
      popularMovies,
      selectedMovie,
    },
  };
}) satisfies GetServerSideProps<HomeProps, { slug?: string[] }>;

export default function Home({
  popularMovies,
  selectedMovie: initialMovie,
}: HomeProps) {
  const router = useRouter();
  const { data: movies, error: moviesError } = usePopularMovies(popularMovies);

  const slug = router.query.slug;
  const movieId =
    Array.isArray(slug) &&
    slug.length === 2 &&
    slug[0] === 'detail' &&
    /^[1-9]\d*$/.test(slug[1])
      ? Number(slug[1])
      : null;

  const { data: selectedMovie, error: selectedMovieError } = useMovieDetail(
    movieId,
    initialMovie,
  );

  const closeModal = () => {
    void router.push('/', undefined, { scroll: false, shallow: true });
  };

  const title = selectedMovie ? `${selectedMovie.title} | 영화 리뷰` : '영화 리뷰';
  const description =
    selectedMovie?.overview ||
    (selectedMovie
      ? `${selectedMovie.title}의 영화 정보와 별점을 확인하세요.`
      : '인기 영화를 살펴보고 나만의 별점을 남겨보세요.');
  const imageUrl = selectedMovie?.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${selectedMovie.backdrop_path}`
    : selectedMovie?.poster_path
      ? `https://image.tmdb.org/t/p/original${selectedMovie.poster_path}`
      : DEFAULT_OG_IMAGE;

  return (
    <>
      <Head>
        <title>{title}</title>
        {(moviesError || selectedMovieError) && <meta name="robots" content="noindex" />}
        <meta name="description" content={description} />
        <meta property="og:title" content={selectedMovie?.title ?? '영화 리뷰'} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
      </Head>

      <div id="wrap">
        <Header featuredMovie={movies?.[0]} error={moviesError} />
        <MovieList movies={movies ?? []} error={moviesError} />
        <Footer />
      </div>

      {selectedMovieError && (
        <MovieDetailErrorModal message={selectedMovieError.message} onClose={closeModal} />
      )}

      {selectedMovie && (
        <MovieDetailModal movie={selectedMovie} onClose={closeModal} />
      )}
    </>
  );
}
