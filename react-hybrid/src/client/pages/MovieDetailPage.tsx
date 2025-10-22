import { useMovieDetailModal } from '../hooks/useMovieDetailModal';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import MovieHomePage from './MovieHomePage';
import { moviesApi } from '../api/movies';

export default function MovieDetailPage() {
  return (
    <>
      <MovieHomePage movies={[]} />
      <DetailPageOpenModal />
    </>
  );
}

function DetailPageOpenModal() {
  const { movieId } = useParams();
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (movieId == null || onceRef.current === true) {
      return;
    }
    (async () => {
      onceRef.current = true;
      const movieDetail = await moviesApi.getDetail(Number(movieId));
      openMovieDetailModal(movieDetail.data);
    })();
  }, [movieId, openMovieDetailModal]);

  return null;
}
