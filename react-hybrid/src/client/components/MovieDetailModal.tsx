import type { MovieDetailResponse } from '../types/MovieDetail.types';
import { IconButton } from './common/IconButton';
import { MovieDetailContent } from './MovieDetailContent';

interface MovieDetailModalProps {
    movie: MovieDetailResponse;
    onClose: () => void;
}

export const MovieDetailModal = ({ movie, onClose }: MovieDetailModalProps) => {
    return (
        <div className="modal-background active">
            <div className="modal">
                {/* 모달 헤더 */}
                <div className="modal-header">
                    <h1 className="modal-title">{movie.title}</h1>
                    <IconButton
                        src="/images/modal_button_close.png"
                        width="24"
                        height="24"
                        onClick={onClose}
                        className="modal-close-btn"
                    />
                </div>

                <MovieDetailContent movie={movie} />
            </div>
        </div>
    );
};
