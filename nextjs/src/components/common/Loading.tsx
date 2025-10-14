import styles from "./Loading.module.css";

interface LoadingProps {
  className?: string;
}

export const Loading = ({ className = "" }: LoadingProps) => {
  return (
    <div className={`${styles.loadingContainer} ${className}`}>
      <div className={styles.loadingSpinner}></div>
    </div>
  );
};
