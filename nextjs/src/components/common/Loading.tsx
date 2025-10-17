interface LoadingProps {
  className?: string;
}

export const Loading = ({ className = '' }: LoadingProps) => {
  return (
    <div className={`loading-container ${className}`}>
      <div className={`loading-spinner`}></div>
    </div>
  );
};
