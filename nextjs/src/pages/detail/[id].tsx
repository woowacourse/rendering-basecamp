import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { MovieDetailModal } from '../../components/MovieDetailModal';
import { moviesApi } from '../../api/movies';
import type { MovieDetailResponse } from '../../types/MovieDetail.types';
import type { MovieItem } from '../../types/Movie.types';
import { useRouter } from 'next/router';

interface DetailPageProps {
  movie: MovieDetailResponse;
  featuredMovie: MovieItem;
}

export default function DetailPage({ movie, featuredMovie }: DetailPageProps) {
  const router = useRouter();

  const handleClose = () => {
    router.push('/');
  };

  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
    : '/images/no_image.png';

  const description = movie.overview || '영화 상세 정보';

  return (
    <>
      <Head>
        <title>{movie.title} - Movie App</title>
        <meta name="description" content={description} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={movie.title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_BASE_URL || ''}/detail/${movie.id}`} />
        <meta property="og:site_name" content="Movie App" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={movie.title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
      </Head>

      <div id="wrap">
        <Header featuredMovie={featuredMovie} />
        <MovieDetailModal movie={movie} onClose={handleClose} />
        <Footer />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  try {
    const movieDetailResponse = await moviesApi.getDetail(Number(id));

    const popularMoviesResponse = await moviesApi.getPopular();
    const featuredMovie = popularMoviesResponse.data.results[0];

    return {
      props: {
        movie: movieDetailResponse.data,
        featuredMovie,
      },
    };
  } catch (error) {
    console.error('Failed to fetch movie details:', error);
    return {
      notFound: true,
    };
  }
};
