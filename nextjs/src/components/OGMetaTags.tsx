import Head from "next/head";

interface OGMetaTagsProps {
  title: string;
  description: string;
  url?: string;
  siteName?: string;
  type?: "website" | "video.movie" | "article";

  image?: string;
  imageWidth?: string;
  imageHeight?: string;
  imageType?: string;

  movieDuration?: string;
  movieReleaseDate?: string;
  movieTags?: string;
}

export const OGMetaTags = ({
  title,
  description,
  url,
  siteName = "영화 추천 사이트",
  type = "website",

  image,
  imageWidth = "1200",
  imageHeight = "630",
  imageType = "image/jpeg",

  movieDuration,
  movieReleaseDate,
  movieTags,
}: OGMetaTagsProps) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && (
        <>
          <meta property="og:image" content={image} />
          <meta property="og:image:width" content={imageWidth} />
          <meta property="og:image:height" content={imageHeight} />
          <meta property="og:image:type" content={imageType} />
        </>
      )}
      {url && <meta property="og:url" content={url} />}
      <meta property="og:site_name" content={siteName} />

      {type === "video.movie" && (
        <>
          {movieDuration && (
            <meta property="video:duration" content={movieDuration} />
          )}
          {movieReleaseDate && (
            <meta property="video:release_date" content={movieReleaseDate} />
          )}
          {movieTags && <meta property="video:tag" content={movieTags} />}
        </>
      )}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
    </Head>
  );
};
