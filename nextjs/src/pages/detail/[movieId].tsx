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

  const ogImageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : `${process.env.NEXT_PUBLIC_SITE_URL}/images/no_image.png`;

  const currentUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/detail/${movie.id}`;

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

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="영화 리뷰 사이트" />
        <meta
          property="og:title"
          content={`${movie.title} - 영화 리뷰 사이트`}
        />
        <meta
          property="og:description"
          content={movie.overview || `${movie.title} 영화 정보를 확인하세요`}
        />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:width" content="500" />
        <meta property="og:image:height" content="750" />
        <meta property="og:image:alt" content={`${movie.title} 포스터`} />
        <meta property="og:url" content={currentUrl} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@영화리뷰사이트" />
        <meta
          name="twitter:title"
          content={`${movie.title} - 영화 리뷰 사이트`}
        />
        <meta
          name="twitter:description"
          content={movie.overview || `${movie.title} 영화 정보를 확인하세요`}
        />
        <meta name="twitter:image" content={ogImageUrl} />
        <meta name="twitter:image:alt" content={`${movie.title} 포스터`} />

        <meta name="author" content="영화 리뷰 사이트" />
        <meta
          name="keywords"
          content={`${movie.title}, 영화, 리뷰, 평점, ${movie.genres
            ?.map(g => g.name)
            .join(', ')}`}
        />
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
