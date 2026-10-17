import { useState } from 'react';
import MovieHomePage from './MovieHomePage';
import { MovieDetailModal } from '../components/MovieDetailModal';
import { useInitialData } from '../contexts/InitialDataContext';

export default function MovieDetailPage() {
  const { movieDetail } = useInitialData();
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleClose = () => {
    setIsModalOpen(false);
    history.pushState(null, '', '/');
  };

  return (
    <>
      <MovieHomePage />
      {isModalOpen && movieDetail && (
        <MovieDetailModal movie={movieDetail} onClose={handleClose} />
      )}
    </>
  );
}
