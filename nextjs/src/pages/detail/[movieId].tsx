import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { MovieHome } from '../index';
import { MovieDetailModal } from '../../components/MovieDetailModal';
import { moviesApi } from '../../api/movies';
import { getOrigin } from '../../utils/url';
import type { MovieItem } from '../../types/Movie.types';
import type { MovieDetailResponse } from '../../types/MovieDetail.types';

interface MovieDetailPageProps {
  movies: MovieItem[];
  movieDetail: MovieDetailResponse;
  pageUrl: string;
}

export const getServerSideProps: GetServerSideProps<
  MovieDetailPageProps,
  { movieId: string }
> = async ({ params, req }) => {
  const movieId = Number(params?.movieId);

  if (!Number.isInteger(movieId)) {
    return { notFound: true };
  }

  const [popularResult, detailResult] = await Promise.allSettled([
    moviesApi.getPopular(),
    moviesApi.getDetail(movieId),
  ]);

  if (detailResult.status === 'rejected') {
    return { notFound: true };
  }

  return {
    props: {
      movies:
        popularResult.status === 'fulfilled'
          ? popularResult.value.data.results
          : [],
      movieDetail: detailResult.value.data,
      pageUrl: `${getOrigin(req)}/detail/${movieId}`,
    },
  };
};

export default function MovieDetailPage({
  movies,
  movieDetail,
  pageUrl,
}: MovieDetailPageProps) {
  // 모달을 서버에서부터 렌더링해 영화 정보가 초기 HTML에 포함되도록 한다.
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <>
      <MovieDetailHead movieDetail={movieDetail} pageUrl={pageUrl} />
      <MovieHome movies={movies} />
      {isModalOpen && (
        <MovieDetailModal
          movie={movieDetail}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

function MovieDetailHead({
  movieDetail,
  pageUrl,
}: {
  movieDetail: MovieDetailResponse;
  pageUrl: string;
}) {
  const {
    title,
    overview,
    backdrop_path,
    poster_path,
    release_date,
    genres,
    vote_average,
    vote_count,
  } = movieDetail;
  const description = overview || `${title}의 상세 정보를 확인해보세요.`;
  const imageUrl = backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${backdrop_path}`
    : poster_path
      ? `https://image.tmdb.org/t/p/w500${poster_path}`
      : null;

  // 검색엔진이 영화 정보로 인식할 수 있도록 schema.org Movie 구조화 데이터를 제공한다.
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: title,
    description,
    url: pageUrl,
    ...(imageUrl && { image: imageUrl }),
    ...(release_date && { datePublished: release_date }),
    genre: genres.map(genre => genre.name),
    ...(vote_count > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: vote_average,
        bestRating: 10,
        ratingCount: vote_count,
      },
    }),
  };

  return (
    <Head>
      <title>{`${title} | 영화 리뷰`}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={pageUrl} />
      <meta property="og:type" content="video.movie" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={pageUrl} />
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      <meta name="twitter:card" content="summary_large_image" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
    </Head>
  );
}
