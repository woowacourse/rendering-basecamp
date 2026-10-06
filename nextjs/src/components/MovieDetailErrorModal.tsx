import { IconButton } from './common/IconButton';

interface MovieDetailErrorModalProps {
  message: string;
  onClose: () => void;
}

export const MovieDetailErrorModal = ({
  message,
  onClose,
}: MovieDetailErrorModalProps) => {
  return (
    <div className="modal-background active">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label="영화 조회 오류"
      >
        <div className="modal-header">
          <h1 className="modal-title">영화 상세 정보</h1>
          <IconButton
            src="/images/modal_button_close.png"
            onClick={onClose}
            className="modal-close-btn"
            aria-label="닫기"
          />
        </div>
        <div className="modal-container">
          <div className="result-container" role="alert">
            <p>{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
