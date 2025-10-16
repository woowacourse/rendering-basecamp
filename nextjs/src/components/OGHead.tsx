import Head from 'next/head';

interface OGHeadProps {
  title: string;
  description: string;
  imageUrl: string;
  url: string;
  width?: number;
  height?: number;
  alt: string;
}

export const OGHead = (props: OGHeadProps) => {
  const {
    title,
    description,
    imageUrl,
    url,
    width = 500,
    height = 750,
    alt,
  } = props;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />

      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content={width.toString()} />
      <meta property="og:image:height" content={height.toString()} />
      <meta property="og:image:alt" content={alt} />
    </Head>
  );
};
