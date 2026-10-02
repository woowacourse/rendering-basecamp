type ImageSize = "w500" | "w1280" | "w1920_and_h800_multi_faces";

export const movieImageUrl = (
  path: string | null,
  size: ImageSize = "w500",
) => (path ? `https://image.tmdb.org/t/p/${size}${path}` : "/images/no_image.png");
