import Head from "next/head";

interface OGMetaTagsProps {
  title: string;
  description: string;
  url?: string;
  siteName?: string;
  type?: "website" | "article" | "video.movie";

  movieDuration?: string;
  movieReleaseDate?: string;
  movieTags?: string;

  image?: string;
  imageWidth?: string;
  imageHeight?: string;
  imageType?: string;
}

export const OGMetaTags = ({
  title,
  description,
  url,
  siteName = "Movielist",
  type = "website",

  movieDuration,
  movieReleaseDate,
  movieTags,

  image,
  imageWidth = "1200",
  imageHeight = "630",
  imageType = "image/jpeg",
}: OGMetaTagsProps) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:site_name" content={siteName} />
      {image && (
        <>
          <meta property="og:image" content={image} />
          <meta property="og:image:width" content={imageWidth} />
          <meta property="og:image:height" content={imageHeight} />
          <meta property="og:image:type" content={imageType} />
        </>
      )}

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
