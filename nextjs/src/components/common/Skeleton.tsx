interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export const Skeleton = ({
  width = "100%",
  height = "20px",
  className = "",
}: SkeletonProps) => {
  const style = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  return <div className={`skeleton-gradient ${className}`} style={style} />;
};
