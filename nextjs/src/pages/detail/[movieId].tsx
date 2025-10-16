import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { useMovieDetailModal } from '../../hooks/useMovieDetailModal';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Header } from '../../components/Header';
import { MovieList } from '../../components/MovieList';
import { Footer } from '../../components/Footer';
import { moviesApi } from '../../api/movies';
import type { MovieItem } from '../../types/Movie.types';
import type { MovieDetailResponse } from '../../types/MovieDetail.types';

interface MovieDetailPageProps {
    movie: MovieDetailResponse;
    movies: MovieItem[];
}

export default function MovieDetailPage({ movie, movies }: MovieDetailPageProps) {
    const featuredMovie = movies[0];

    const ogImage = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : '/images/logo.png';

    const description = movie.overview || `${movie.title} - 영화 상세 정보`;
    const genres = movie.genres.map(g => g.name).join(', ');

    return (
        <>
            <Head>
                <title>{movie.title} - 영화 상세 정보</title>
                <meta name="description" content={description} />
                <meta name="keywords" content={`${movie.title}, 영화, ${genres}`} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />

                <meta property="og:title" content={`${movie.title} - 영화 상세 정보`} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={ogImage} />
                <meta property="og:type" content="video.movie" />
                <meta property="og:locale" content="ko_KR" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${movie.title} - 영화 상세 정보`} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={ogImage} />

                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Movie",
                            "name": movie.title,
                            "description": description,
                            "image": ogImage,
                            "genre": movie.genres.map(g => g.name),
                            "aggregateRating": {
                                "@type": "AggregateRating",
                                "ratingValue": movie.vote_average,
                                "ratingCount": movie.vote_count,
                            },
                        }),
                    }}
                />
            </Head>
            <div id="wrap">
                <Header featuredMovie={featuredMovie} />
                <MovieList movies={movies} />
                <Footer />
            </div>
            <DetailPageOpenModal movie={movie} />
        </>
    );
}

function DetailPageOpenModal({ movie }: { movie: MovieDetailResponse }) {
    const router = useRouter();
    const { openMovieDetailModal } = useMovieDetailModal();
    const onceRef = useRef(false);

    useEffect(() => {
        if (onceRef.current === true) {
            return;
        }

        onceRef.current = true;
        openMovieDetailModal(movie).then(() => {
            router.push('/');
        });
    }, [movie, openMovieDetailModal, router]);

    return null;
}

export const getServerSideProps: GetServerSideProps<MovieDetailPageProps> = async (context) => {
    const { movieId } = context.params as { movieId: string };

    try {
        const [movieDetailResponse, moviesResponse] = await Promise.all([
            moviesApi.getDetail(Number(movieId)),
            moviesApi.getPopular(),
        ]);

        return {
            props: {
                movie: movieDetailResponse.data,
                movies: moviesResponse.data.results,
            },
        };
    } catch (error) {
        console.error('Failed to fetch movie detail:', error);
        return {
            notFound: true,
        };
    }
};


