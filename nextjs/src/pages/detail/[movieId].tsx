import { GetServerSideProps } from 'next';
import { useMovieDetailModal } from '../../hooks/useMovieDetailModal';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
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

    return (
        <>

            <div id="wrap">
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


