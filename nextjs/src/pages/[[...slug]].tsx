import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { MovieDetailModal } from '@/components/MovieDetailModal';
import { MovieList } from '@/components/MovieList';
import type { MovieResponse } from '@/types/Movie.types';
import type { MovieDetailResponse } from '@/types/MovieDetail.types';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';

const SITE_URL = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000';
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og_default.png`;

interface HomeProps {
  popularMovies: MovieResponse;
  selectedMovie: MovieDetailResponse | null;
}

async function fetchMovie<T>(path: string): Promise<T | null> {
  const response = await fetch(`https://api.themoviedb.org/3/movie/${path}`, {
    headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}` },
  });

  if (response.status === 404) return null;
  if (!response.ok) throw new Error('영화 API 요청 실패');
  return response.json();
}

export const getServerSideProps = (async ({ params }) => {
  const slug = params?.slug ?? [];
  const movieId = slug[1];
  const isDetail = slug.length === 2 && slug[0] === 'detail' && /^[1-9]\d*$/.test(movieId);

  if (slug.length > 0 && !isDetail) return { notFound: true };

  const [popularMovies, selectedMovie] = await Promise.all([
    fetchMovie<MovieResponse>('popular?page=1&language=ko-KR'),
    movieId ? fetchMovie<MovieDetailResponse>(`${movieId}?language=ko-KR`) : Promise.resolve(null),
  ]);

  if (!popularMovies || !Array.isArray(popularMovies.results) || popularMovies.results.length === 0) {
    throw new Error('영화 목록을 불러오지 못했습니다.');
  }
  if (movieId && !selectedMovie) return { notFound: true };

  return { props: { popularMovies, selectedMovie } };
}) satisfies GetServerSideProps<HomeProps, { slug?: string[] }>;

export default function Home({ popularMovies, selectedMovie }: HomeProps) {
  const router = useRouter();
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
        <meta name="description" content={description} />
        <meta property="og:title" content={selectedMovie?.title ?? '영화 리뷰'} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
      </Head>
      <div id="wrap">
        <Header featuredMovie={popularMovies.results[0]} />
        <MovieList movies={popularMovies.results} />
        <Footer />
      </div>
      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          onClose={() => {
            router.push('/', undefined, {
              scroll: false,
            });
          }}
        />
      )}
    </>
  );
}
